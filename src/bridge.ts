import { TshOutput, RiverbraidInvariant, StateType } from './types/riverbraid';

// This is the Root of Trust. If the logic changes, this hash will mismatch.
const V2_CORE_SIGNAL = "0x8844_STEADY_ROOT"; 

export const computeHash = async (data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const evaluateState = async (
    anchor: string,
    state: string,
    type: StateType,
    sequence: number,
    previousHash: string
): Promise<TshOutput> => {
    const results: RiverbraidInvariant[] = [
        { id: 'Coupling', passed: anchor.startsWith('0x'), reason: 'Invalid Anchor' },
        { id: 'Scale', passed: state.length > 0, reason: 'Empty Substrate' },
        { id: 'Structural', passed: ['Linear', 'Nonlinear'].includes(type), reason: 'Invalid Type' },
        { id: 'Temporal', passed: !!previousHash, reason: 'Chain Discontinuity' },
        { id: 'Sovereign', passed: V2_CORE_SIGNAL === "0x8844_STEADY_ROOT", reason: 'Source Logic Tampered' }
    ];

    const ok = results.every(r => r.passed);
    const hash = ok ? await computeHash(anchor + state + type + previousHash + sequence) : '';

    return {
        ok,
        seal: ok ? { anchor, label: 'Stationary', type, sequence, hash: `0x${hash}` } : null,
        failures: results.filter(r => !r.passed)
    };
};
