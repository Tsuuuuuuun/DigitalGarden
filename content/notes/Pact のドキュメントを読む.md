---
title:
draft: false
tags:
created: 2025-11-27
modified:
description: ""
---

https://docs.pact.io/

https://docs.pact.io/getting_started/how_pact_works

[[notes/Consumer Driven Contract|Consumer Driven Contract]] テストを行うためのテストツール。consumer が実際に用いる部分のみテストされる。

## Consumer testing

Consumer Pact テストは、「provider がこのリクエストに対して期待される応答を返すと仮定した場合、consumer は正しくリクエストを生成し、期待される応答を処理しているか」を判断する。

![](https://docs.pact.io/assets/images/pact-overview-b3088a94483efb5688c79f98ceaa3c0d.png)

1. Pact DSL を用いて、期待されるリクエストと応答がモックサービスに登録される。
2. consumer テストコードは、Pact フレームワークによって作成された mock provider に実際のリクエストを実行する。
3. mock provider は実際のリクエストと期待されたリクエストを比較し、比較が成功すれば期待される応答を出力する。
4. consumer テストコードは、応答が正しく理解されたことを確認する。

## Provider verification

消費者テストに対して、provider の検証は完全に Pact フレームワークによって行われる。

![](https://docs.pact.io/assets/images/pact-verification-f1b93dfd857a7db3e02980b5ff4e1259.png)

Provider 検証では、各リクエストが provider に送信され、実際に生成される応答を consumer テストで記述された最小期待応答と比較する。各リクエストが期待されるレスポンスに記述されたデータを含むレスポンスを生成した場合、合格となる。

多くの場合、provider は特定の状態にある必要がある。Pact フレームワークは、インタラクションを再実行する前に Provider 状態で記述されたデータをセットアップできるようサポートすることでこの要件をサポートする。

![](https://docs.pact.io/assets/images/pact-verification-states-c5c318ae14905e0a90bcc9eeaa005998.png)

![](https://docs.pact.io/assets/images/pact-test-and-verify-7ae6e70a9a42ffa4ac8373ba294b19d9.png)

各インタラクションにおいて、consumer 側のテストと provider 側の検証プロセスをペアで実行すれば、サービスを個別に起動することなく、consumer と provider の間の契約を完全にテストできる。

## getting started

https://docs.pact.io/5-minute-getting-started-guide

### Consumer Pact Test

まずはモデルクラスの定義から始める。以下にシンプルなモデルクラスを想定する。これはリモートサーバー上にあって、Order API への HTTP リクエストによって取得する必要がある。

```javascript
class Order {
    constructor(id, items) {
        this.id = id
        this.items = items
    }

    total() {
        return this.items.reduce((acc, v) => {
            acc += v.quantity * v.value
            return acc
        }, 0)
    }

    toString() {
        return `Order ${this.id}, Total: ${this.total()}`
    }
}

module.exports = {
    Order,
}
```

```javascript
module.exports = [
    {
        id: 1,
        items: [
            {
                name: "burger",
                quantity: 2,
                value: 20,
            },
            {
                name: "coke",
                quantity: 2,
                value: 5,
            },
        ],
    },
]
```

次に Order API のクライアントを作成する。

```javascript
const request = require("superagent")
const { Order } = require("./order")

const fetchOrders = () => {
    return request.get(`http://localhost:${process.env.API_PORT}/orders`).then(
        (res) => {
            return res.body.reduce((acc, o) => {
                acc.push(new Order(o.id, o.items))
                return acc
            }, [])
        },
        (err) => {
            console.log(err)
            throw new Error(`Error from response: ${err.body}`)
        },
    )
}

module.exports = {
    fetchOrders,
}
```

次にモック版のAPIを設定する。以下のコードを実行すると、`localhost:1234` 上にモックサービスが作成され、アプリケーションからの HTTP リクエストに対して、実際の Order API であるかのように応答する。また、期待値に設定する際に利用する mock provider オブジェクトも作成される。

```javascript
// Import Pact & other dependencies
const pact = require("@pact-foundation/pact")
const Pact = pact.PactV3
const path = require("path")

// Setup Pact
const provider = new Pact({
    log: path.resolve(process.cwd(), "logs", "pact.log"),
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: "info",
    consumer: consumerName,
    provider: providerName,
})
```

最後にがテストケース[^1]を作成する。

```javascript
// Setting up our test framework
const chai = require("chai")
const expect = chai.expect
const chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)

// We need Pact in order to use it in our test
const { provider } = require("../pact")
const { eachLike } = require("@pact-foundation/pact").MatchersV3

// Importing our system under test (the orderClient) and our Order model
const { Order } = require("./order")
const { fetchOrders } = require("./orderClient")

// This is where we start writing our test
describe("Pact with Order API", () => {
    describe("given there are orders", () => {
        const itemProperties = {
            name: "burger",
            quantity: 2,
            value: 100,
        }

        const orderProperties = {
            id: 1,
            items: eachLike(itemProperties),
        }

        describe("when a call to the API is made", () => {
            before(() => {
                provider
                    .given("there are orders")
                    .uponReceiving("a request for orders")
                    .withRequest({
                        method: "GET",
                        path: "/orders",
                    })
                    .willRespondWith({
                        body: eachLike(orderProperties),
                        status: 200,
                        headers: {
                            "Content-Type": "application/json; charset=utf-8",
                        },
                    })
            })

            it("will receive the list of current orders", () => {
                return provider.executeTest((mockserver) => {
                    // The mock server is started on a randomly available port,
                    // so we set the API mock service port so HTTP clients
                    // can dynamically find the endpoint
                    process.env.API_PORT = mockserver.port
                    return expect(fetchOrders()).to.eventually.have.deep.members([
                        new Order(orderProperties.id, [itemProperties]),
                    ])
                })
            })
        })
    })
})
```

パスした Order API を実行すると、設定された Pact ディレクトリに pact ファイルが生成される。

### Provider Pact Test

consumer 側のテストを作成して実行し、pact ファイルを生成したら、次は Order API の管理を担当するチームとこの契約を共有する必要がある。これによって、契約で定められたすべての要件を満たしていることを確認できるようになる。Pact Broker の使用が推奨されている。

Provider 側では、Pact はサービスに対するすべてのインタラクション（通常は HTTP リクエスト）を再生する必要がある。以下の選択肢の中からどれかを選ぶ。

- MVCアプリケーションでは controller 層のみを呼び出して、その下位の層はスタブ化する。
- 実際のデータベースを使用するか、モック化されたデータベースを使用するか選択する。
- モックHTTPサーバーを使用するか、外部サービス用のモックを使用するか選択する。

ふつう、DBや外部サービスはモック化する。

まず、Order API を作成する。

```javascript
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const server = express()

server.use(cors())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use((_, res, next) => {
    res.header("Content-Type", "application/json; charset=utf-8")
    next()
})

// "In memory" data store
let dataStore = require("./data/orders.js")

server.get("/orders", (_, res) => {
    res.json(dataStore)
})

module.exports = {
    server,
    dataStore,
}
```

次に、provider 検証のタスクを実行する必要がある。手順は以下の通り。

1. Pact に対して契約ファイルの場所と、Order API が動作する場所を指定する。
2. API を起動する。
3. Provider 検証タスクを実行する。

```javascript
const Verifier = require("@pact-foundation/pact").Verifier
const chai = require("chai")
const chaiAsPromised = require("chai-as-promised")
const getPort = require("get-port")
const { server } = require("./provider.js")
const { providerName, pactFile } = require("../pact.js")
chai.use(chaiAsPromised)
let port
let opts
let app

// Verify that the provider meets all consumer expectations
describe("Pact Verification", () => {
    before(async () => {
        port = await getPort()
        opts = {
            provider: providerName,
            providerBaseUrl: `http://localhost:${port}`,
            // pactUrls: [pactFile], // if you don't use a broker
            pactBrokerUrl: "https://test.pactflow.io",
            pactBrokerToken: "129cCdfCWhMzcC9pFwb4bw",
            publishVerificationResult: false,
            providerVersionBranch: process.env.GIT_BRANCH ?? "master",
            providerVersion: process.env.GIT_COMMIT ?? "1.0." + process.env.HOSTNAME,
            consumerVersionSelectors: [{ mainBranch: true }, { deployedOrReleased: true }],
        }

        app = server.listen(port, () => {
            console.log(`Provider service listening on http://localhost:${port}`)
        })
    })

    after(() => {
        if (app) {
            app.close()
        }
    })
    it("should validate the expectations of Order Web", () => {
        return new Verifier(opts)
            .verifyProvider()
            .then((output) => {
                console.log("Pact Verification Complete!")
                console.log(output)
            })
            .catch((e) => {
                console.error("Pact verification failed :(", e)
            })
    })
})
```

---

[^1]: ここで確認しているのは「契約通りにリクエストを送ることができるか」「理想的なレスポンスが返ってきた時、それを受け止めることができるか」
