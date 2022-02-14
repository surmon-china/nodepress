export declare const enum BooleanNumberValue {
    False = 0,
    True = 1
}
export declare class DateQueryDTO {
    date?: string;
}
export declare class KeywordQueryDTO {
    keyword?: string;
}
export declare class BooleanQueryDTO {
    boolean?: BooleanNumberValue.True | BooleanNumberValue.False;
}
