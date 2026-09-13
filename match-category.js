function guessCategoryFromUrl(url) {
    const categories = ["AWS", "Azure", "DevOps", "Terraform", "Linux", "Interview", "Career", "AI", "Networking"];
    const lowerUrl = url.toLowerCase();
    
    // Check keywords in the URL text
    if (lowerUrl.includes('aws') || lowerUrl.includes('amazon-web-services')) return "AWS";
    if (lowerUrl.includes('azure')) return "Azure";
    if (lowerUrl.includes('devops')) return "DevOps";
    if (lowerUrl.includes('terraform')) return "Terraform";
    if (lowerUrl.includes('linux')) return "Linux";
    if (lowerUrl.includes('interview')) return "Interview";
    if (lowerUrl.includes('career') || lowerUrl.includes('hiring') || lowerUrl.includes('jobs')) return "Career";
    if (lowerUrl.includes('ai-') || lowerUrl.includes('-ai-') || lowerUrl.includes('artificial-intelligence') || lowerUrl.includes('openai') || lowerUrl.includes('chatgpt') || lowerUrl.includes('machine-learning')) return "AI";
    if (lowerUrl.includes('network')) return "Networking";
    
    return ""; // No category found
}

console.log(guessCategoryFromUrl("https://www.linkedin.com/posts/openai_sora-is-now-available-to-all-chatgpt-plus-activity-7272288079555198978-i12O"));
