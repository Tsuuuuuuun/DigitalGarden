document.addEventListener("nav", async () => {
  const pageViewsElements = document.querySelectorAll(".page-views")

  for (const element of pageViewsElements) {
    const websiteId = element.getAttribute("data-goatcounter-id")
    const path = element.getAttribute("data-path")
    const countElement = element.querySelector(".page-view-count")

    if (!websiteId || !path || !countElement) continue

    try {
      // Normalize path for GoatCounter API
      const normalizedPath = path === "index" ? "/" : `/${path}`
      const apiUrl = `https://${websiteId}.goatcounter.com/counter${normalizedPath}.json`

      const response = await fetch(apiUrl)

      if (response.ok) {
        const data = await response.json()
        countElement.textContent = data.count || "0"
      } else {
        countElement.textContent = "N/A"
      }
    } catch (error) {
      console.error("Failed to fetch page views:", error)
      countElement.textContent = "N/A"
    }
  }
})
