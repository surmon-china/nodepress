export interface GuestRequestOption<T = any> {
    only?: T[];
    default?: T;
}
export declare function WhenGuest(option: GuestRequestOption): (target: any, propertyName: string) => void;
export declare const getGuestRequestOptions: (target: any) => Record<string, GuestRequestOption>;
