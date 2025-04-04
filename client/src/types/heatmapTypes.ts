export type Event = {
    uuid: string;
    actor_type: string;
    actor_id: "" | number;
    actor_name: string;
    actor_email: string;
    action: "unlock";
    authenticated_by_type: string;
    authenticated_by_id: "" | number;
    object_type: string;
    object_id: number;
    object_name: string;
    success: boolean;
    code: string;
    message: string;
    created_at: string;
};

export type SuccessEventWithUsers = {
    counter: number;
    uniqueUsers: number[];
};

export type GroupedType = Record<
    string,
    Record<string, Record<string, SuccessEventWithUsers>>
>;
