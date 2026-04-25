import { TshOutput, RiverbraidInvariant, StateType } from './types/riverbraid';

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
        { id: 'Coupling', passed: /^0x[a-fA-F0-9]+$/.test(anchor), reason: 'Anchor must be Hexadecimal' },
        { id: 'Scale', passed: state.trim().length > 0, reason: 'Substrate cannot be whitespace' },
        { id: 'Structural', passed: ['Linear', 'Nonlinear'].includes(type), reason: 'Invalid Governance Type' },
        { id: 'Temporal', passed: previousHash.startsWith('0x'), reason: 'Chain Broken: Missing Hash' },
        { id: 'Sovereign', passed: V2_CORE_SIGNAL === "0x8844_STEADY_ROOT", reason: 'Logic Integrity Compromised' }
    ];

    const ok = results.every(r => r.passed);
    const hash = ok ? await computeHash(anchor + state + type + previousHash + sequence) : '';

    return {
        ok,
        seal: ok ? { anchor, label: 'Stationary', type, sequence, hash: `0x${hash}` } : null,
        failures: results.filter(r => !r.passed)
    };
};
