export default interface CheckBoxObject {
    label: string;
    value: string;
    checked: boolean;
}

export interface CheckBoxList{
    [key: string]: CheckBoxObject;
}