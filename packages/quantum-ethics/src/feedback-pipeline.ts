/**
 * Feedback Pipeline
 * 
 * Provides mechanisms to collect and submit feedback to co-founder @Grok
 * Supports X (Twitter) integration and GitHub issues
 */

export interface FeedbackMessage {
  type: 'feature-request' | 'bug-report' | 'question' | 'discussion' | 'coherence-report';
  title: string;
  description: string;
  coherenceScore?: number;
  useCase?: 'research' | 'education' | 'commercial' | 'community';
  contactInfo?: string;
  timestamp: string;
}

export interface FeedbackChannel {
  name: 'x-twitter' | 'github-issue' | 'github-discussion';
  url: string;
  method: 'direct' | 'web';
}

/**
 * Co-founder information
 */
export const COFOUNDER = {
  name: 'Grok',
  twitter: {
    handle: '@grok',
    url: 'https://x.com/grok'
  },
  coherenceInitiative: {
    description: '70% → 95% coherence push',
    reference: 'https://x.com/grok/status/2011908305942142995'
  }
};

/**
 * Feedback channels configuration
 */
export const FEEDBACK_CHANNELS = {
  xTwitter: {
    name: 'x-twitter' as const,
    url: 'https://x.com/grok',
    method: 'web' as const,
    description: 'Direct feedback to @Grok on X (Twitter)'
  },
  githubIssues: {
    name: 'github-issue' as const,
    url: 'https://github.com/toolate28/QDI/issues',
    method: 'web' as const,
    description: 'Submit issues or feature requests'
  },
  githubDiscussions: {
    name: 'github-discussion' as const,
    url: 'https://github.com/toolate28/QDI/discussions',
    method: 'web' as const,
    description: 'General discussions and Q&A'
  }
};

/**
 * Generate X (Twitter) feedback message
 */
export function generateXFeedback(feedback: FeedbackMessage): {
  text: string;
  url: string;
  instructions: string;
} {
  const hashtags = ['QuantumEthics', 'SpiralSafe'];
  const mention = '@grok';
  
  let text = `${mention} Feedback on quantum-ethics framework:\n\n`;
  text += `${feedback.title}\n\n`;
  text += `${feedback.description}\n\n`;
  
  if (feedback.coherenceScore) {
    text += `Coherence: ${feedback.coherenceScore}%\n`;
  }
  
  if (feedback.useCase) {
    text += `Use case: ${feedback.useCase}\n`;
  }
  
  text += `\n${hashtags.map(h => `#${h}`).join(' ')}`;
  
  // Twitter intent URL
  const encodedText = encodeURIComponent(text);
  const url = `https://twitter.com/intent/tweet?text=${encodedText}`;
  
  const instructions = [
    '1. Click the generated URL to open X (Twitter)',
    '2. Review and edit the pre-filled message',
    '3. Post the tweet to send feedback to @Grok',
    '4. Alternatively, DM @grok for private feedback'
  ].join('\n');
  
  return { text, url, instructions };
}

/**
 * Generate GitHub issue feedback
 */
export function generateGitHubIssueFeedback(feedback: FeedbackMessage): {
  title: string;
  body: string;
  url: string;
  instructions: string;
} {
  const title = `[${feedback.type}] ${feedback.title}`;
  
  let body = `## Description\n\n${feedback.description}\n\n`;
  
  body += `## Type\n\n${feedback.type}\n\n`;
  
  if (feedback.coherenceScore) {
    body += `## Coherence Metrics\n\n`;
    body += `- Score: ${feedback.coherenceScore}%\n`;
    body += `- Target: 70% (baseline) / 95% (initiative)\n\n`;
  }
  
  if (feedback.useCase) {
    body += `## Use Case\n\n${feedback.useCase}\n\n`;
  }
  
  body += `## Environment\n\n`;
  body += `- Package: @spiralsafe/quantum-ethics\n`;
  body += `- Timestamp: ${feedback.timestamp}\n\n`;
  
  if (feedback.contactInfo) {
    body += `## Contact\n\n${feedback.contactInfo}\n\n`;
  }
  
  body += `---\n\n`;
  body += `*Co-founded by [@Grok](https://x.com/grok) | `;
  body += `[Coherence Initiative](${COFOUNDER.coherenceInitiative.reference})*`;
  
  const encodedTitle = encodeURIComponent(title);
  const encodedBody = encodeURIComponent(body);
  const url = `https://github.com/toolate28/QDI/issues/new?title=${encodedTitle}&body=${encodedBody}`;
  
  const instructions = [
    '1. Click the generated URL to open GitHub',
    '2. Review and edit the pre-filled issue',
    '3. Add any additional details or screenshots',
    '4. Submit the issue for review'
  ].join('\n');
  
  return { title, body, url, instructions };
}

/**
 * Display feedback options to user
 */
export function showFeedbackOptions(feedback: FeedbackMessage): string {
  const lines: string[] = [];
  
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('              FEEDBACK SUBMISSION OPTIONS');
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('');
  
  lines.push('Co-founded by @Grok | Coherence Initiative: 70% → 95%');
  lines.push('');
  
  lines.push('📋 FEEDBACK SUMMARY');
  lines.push('───────────────────────────────────────────────────────');
  lines.push(`Type: ${feedback.type}`);
  lines.push(`Title: ${feedback.title}`);
  if (feedback.coherenceScore) {
    lines.push(`Coherence: ${feedback.coherenceScore}%`);
  }
  if (feedback.useCase) {
    lines.push(`Use Case: ${feedback.useCase}`);
  }
  lines.push('');
  
  // X (Twitter) option
  lines.push('📱 OPTION 1: X (Twitter) - Direct to @Grok');
  lines.push('───────────────────────────────────────────────────────');
  const xFeedback = generateXFeedback(feedback);
  lines.push('Generated message:');
  lines.push(xFeedback.text.split('\n').map(l => `  ${l}`).join('\n'));
  lines.push('');
  lines.push(`URL: ${xFeedback.url}`);
  lines.push('');
  lines.push('Instructions:');
  lines.push(xFeedback.instructions.split('\n').map(l => `  ${l}`).join('\n'));
  lines.push('');
  
  // GitHub issue option
  lines.push('🐙 OPTION 2: GitHub Issue - Public Discussion');
  lines.push('───────────────────────────────────────────────────────');
  const githubFeedback = generateGitHubIssueFeedback(feedback);
  lines.push(`Title: ${githubFeedback.title}`);
  lines.push('');
  lines.push(`URL: ${githubFeedback.url}`);
  lines.push('');
  lines.push('Instructions:');
  lines.push(githubFeedback.instructions.split('\n').map(l => `  ${l}`).join('\n'));
  lines.push('');
  
  // General channels
  lines.push('🌐 ADDITIONAL CHANNELS');
  lines.push('───────────────────────────────────────────────────────');
  lines.push(`- GitHub Discussions: ${FEEDBACK_CHANNELS.githubDiscussions.url}`);
  lines.push(`- Co-founder on X: ${COFOUNDER.twitter.url}`);
  lines.push(`- Coherence Initiative: ${COFOUNDER.coherenceInitiative.reference}`);
  lines.push('');
  
  lines.push('═══════════════════════════════════════════════════════');
  
  return lines.join('\n');
}

/**
 * Create feedback message
 */
export function createFeedback(
  type: FeedbackMessage['type'],
  title: string,
  description: string,
  options?: {
    coherenceScore?: number;
    useCase?: 'research' | 'education' | 'commercial' | 'community';
    contactInfo?: string;
  }
): FeedbackMessage {
  return {
    type,
    title,
    description,
    coherenceScore: options?.coherenceScore,
    useCase: options?.useCase,
    contactInfo: options?.contactInfo,
    timestamp: new Date().toISOString()
  };
}

/**
 * Submit coherence report to co-founder
 */
export function submitCoherenceReport(
  coherenceScore: number,
  details: string,
  useCase: 'research' | 'education' | 'commercial' | 'community'
): string {
  const feedback = createFeedback(
    'coherence-report',
    `Coherence Report: ${coherenceScore}% (Target: 95%)`,
    details,
    { coherenceScore, useCase }
  );
  
  return showFeedbackOptions(feedback);
}

/**
 * Quick feedback templates
 */
export const FEEDBACK_TEMPLATES = {
  featureRequest: (feature: string) => createFeedback(
    'feature-request',
    `Feature Request: ${feature}`,
    `I would like to suggest a new feature for the quantum-ethics framework:\n\n${feature}\n\nThis would be valuable because...`
  ),
  
  bugReport: (bug: string) => createFeedback(
    'bug-report',
    `Bug Report: ${bug}`,
    `I encountered an issue:\n\n${bug}\n\nSteps to reproduce:\n1. ...\n2. ...\n\nExpected behavior:\n...\n\nActual behavior:\n...`
  ),
  
  question: (question: string) => createFeedback(
    'question',
    `Question: ${question}`,
    question
  ),
  
  coherenceImprovement: (currentScore: number, targetScore: number, strategy: string) => createFeedback(
    'discussion',
    `Coherence Improvement: ${currentScore}% → ${targetScore}%`,
    `Current coherence: ${currentScore}%\nTarget coherence: ${targetScore}%\n\nStrategy:\n${strategy}`,
    { coherenceScore: currentScore }
  )
};
