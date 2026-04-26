import { describe, it, expect, vi } from 'vitest';
import { processQuery } from './assistantLogic';

describe('Voter-saathi Assistant Logic Engine', () => {
  it('Should strictly block political opinions and suggest its neutral failsafe', async () => {
    // The fallback logic intercepts political opinions immediately
    const query = "Who should I vote for? BJP or Congress?";
    const response = await processQuery(query, []);
    expect(response).toContain("secret and sacred decision");
    expect(response).toContain("ensure you get to the booth comfortably");
  });

  it('Should provide an error fallback when API fails or is misconfigured', async () => {
    // With invalid/failing configuration, it falls back safely without crashing
    const response = await processQuery("How do I vote?", []);
    expect(response).to.match(/API Key is not configured|network issues connecting/);
  });
});
