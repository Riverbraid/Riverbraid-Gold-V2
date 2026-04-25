import { TshOutput, RiverbraidInvariant, StateSeal, StateType } from './types/riverbraid';

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
        { id: 'Structural', passed: ['Linear', 'Nonlinear'].includes(type), reason: 'Unknown Type' }
    ];

    const ok = results.every(r => r.passed);
    const hash = ok ? await computeHash(anchor + state + type + previousHash + sequence) : '';

    return {
        ok,
        seal: ok ? { anchor, label: 'Stationary', type, sequence, hash: `0x${hash}` } : null,
        failures: results.filter(r => !r.passed)
    };
};
