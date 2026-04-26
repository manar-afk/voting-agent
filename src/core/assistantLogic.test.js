import { describe, it, expect } from 'vitest';
import { processQuery } from './assistantLogic';

describe('Voter-saathi Assistant Logic Engine', () => {
  it('Should strictly block political opinions and suggest its neutral failsafe', async () => {
    // The fallback logic intercepts political opinions immediately
    const query = "Who should I vote for? BJP or Congress?";
    const response = await processQuery(query, []);
    expect(response).toContain("secret and sacred decision");
    expect(response).toContain("ensure you get to the booth comfortably");
  });

  it('Should provide an error fallback when API is misconfigured offline', async () => {
    // With dummy API key or no key, it falls back
    const response = await processQuery("How do I vote?", []);
    expect(response).toContain("API Key is not configured");
  });
});
