export type StateLabel = 'Stationary' | 'Transitioning' | 'Degraded';
export type StateType = 'Linear' | 'Nonlinear';

export interface RiverbraidInvariant {
    id: string;
    passed: boolean;
    reason?: string;
}

export interface StateSeal {
    anchor: string;
    label: StateLabel;
    type: StateType;
    sequence: number;
    hash: string;
}

export interface TshOutput {
    ok: boolean;
    seal: StateSeal | null;
    failures: RiverbraidInvariant[];
}
