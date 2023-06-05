import { IInstallationData } from "@contentstack/app-sdk/dist/src/types";

export interface KeyValueObj {
  [key: string]: string;
}

export interface TypeAppSdkConfigState {
  installationData: IInstallationData;
  setInstallationData: (event: any) => any;
  appSdkInitialized: boolean;
}

export interface TypeSDKData {
  config: any;
  location: any;
  appSdkInitialized: boolean;
}

export interface TypeEntryData {
  title: string;
  uid: string;
}

export interface ColorPickerData {
  showPicker: boolean;
  pickerColor: {
    r: any;
    g: any;
    b: any;
    a: any;
  };
}
