export type Classification = "Real" | "Suspicious" | "Fake";
export type Sentiment = "Positive" | "Neutral" | "Negative";
export type Bias = "Left-Leaning" | "Center" | "Right-Leaning" | "Unknown";

export interface AnalysisResult {
  classification: Classification;
  confidence: number;
  explanation: string;
  metrics: {
    clickbaitLevel: number; // 0-100
    objectivityScore: number; // 0-100
    readabilityScore: number; // 0-100
  };
  sentiment: Sentiment;
  bias: Bias;
  flaggedKeywords: string[];
  suggestedQueries?: string[];
}

export async function analyzeText(text: string): Promise<AnalysisResult> {
  // Simulate network delay for AI processing
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const lowerText = text.toLowerCase();
  
  // Fake keywords & logic
  const fakeKeywordsFull = [
    "shocking", "won't believe", "miracle cure", "secret", "hoax", 
    "conspiracy", "alien", "100% true", "illuminati", "hide this", "scam",
    "banned", "outrage", "exposed", "destroy"
  ];
  
  const foundFakeKeywords = fakeKeywordsFull.filter(word => lowerText.includes(word));
  const fakeScore = foundFakeKeywords.length;

  const realKeywords = ["reported", "according to", "stated", "research", "study", "university", "official", "government", "police", "announced", "data", "journal"];
  const realScore = realKeywords.filter(word => lowerText.includes(word)).length;

  const wordCount = text.split(/\s+/).length;
  
  // Basic mock metric generation
  const generateMetrics = (baseClickbait: number, baseObjectivity: number) => {
    return {
      clickbaitLevel: Math.min(100, Math.max(0, baseClickbait + Math.floor(Math.random() * 20 - 10))),
      objectivityScore: Math.min(100, Math.max(0, baseObjectivity + Math.floor(Math.random() * 15 - 5))),
      readabilityScore: Math.min(100, Math.max(0, 40 + Math.floor(Math.random() * 45))), // Random readability
    };
  };

  let sentiment: Sentiment = "Neutral";
  if (lowerText.includes("outrage") || lowerText.includes("destroy") || lowerText.includes("scam") || lowerText.includes("hate")) {
    sentiment = "Negative";
  } else if (lowerText.includes("miracle") || lowerText.includes("breakthrough") || lowerText.includes("amazing")) {
    sentiment = "Positive";
  }

  // Mock Bias
  const biasOptions: Bias[] = ["Center", "Unknown", "Left-Leaning", "Right-Leaning"];
  const mockBias = biasOptions[Math.floor(Math.random() * biasOptions.length)];

  // Generate suggested queries if flagged keywords are found
  const suggestedQueries = foundFakeKeywords.length > 0 
    ? foundFakeKeywords.map(kw => `fact check ${kw} news`)
    : ["fact check recent news"];

  if (lowerText.length < 50) {
    return {
      classification: "Suspicious",
      confidence: 55,
      explanation: "The text is too short to provide a confident analysis. It lacks the depth typically found in reliable reporting.",
      metrics: generateMetrics(30, 40),
      sentiment,
      bias: "Unknown",
      flaggedKeywords: foundFakeKeywords,
      suggestedQueries
    };
  }

  if (fakeScore > realScore && fakeScore > 0) {
    return {
      classification: "Fake",
      confidence: Math.min(85 + fakeScore * 4, 99),
      explanation: "This text uses highly sensationalized language and aggressive emotional appeals typical of clickbait or fabricated content.",
      metrics: generateMetrics(90, 15),
      sentiment,
      bias: mockBias,
      flaggedKeywords: foundFakeKeywords,
      suggestedQueries
    };
  } else if (realScore > fakeScore) {
    return {
      classification: "Real",
      confidence: Math.min(75 + realScore * 5, 98),
      explanation: "The structure and terminology align closely with standard informational or credible journalistic reporting practices.",
      metrics: generateMetrics(10, 85),
      sentiment,
      bias: realScore > 3 ? "Center" : mockBias,
      flaggedKeywords: foundFakeKeywords
    };
  } else {
    // Ambiguous middle
    const random = Math.random();
    if (random > 0.6) {
      return {
        classification: "Suspicious",
        confidence: 68,
        explanation: "While it lacks overt red flags, the piece is missing strong verification markers like cited sources or detailed context.",
        metrics: generateMetrics(40, 50),
        sentiment,
        bias: mockBias,
        flaggedKeywords: foundFakeKeywords,
        suggestedQueries
      };
    } else {
      return {
        classification: "Real",
        confidence: 72,
        explanation: "Tone appears relatively neutral and informative, though independent fact-checking of its core claims is advised.",
        metrics: generateMetrics(20, 70),
        sentiment, // Keep it neutral mostly
        bias: "Center",
        flaggedKeywords: foundFakeKeywords
      };
    }
  }
}
