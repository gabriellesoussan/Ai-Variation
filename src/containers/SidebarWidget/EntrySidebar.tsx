import Icon from "../../assets/sidebarwidget.svg";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import React, { useState, useEffect } from "react";
import { Button, Heading, InstructionText, Select, ValidationMessage } from "@contentstack/venus-components";
import "@contentstack/venus-components/build/main.css";
import axios from "axios";
import ContentstackAppSdk from "@contentstack/app-sdk";
import { KeyValueObj, TypeSDKData, TypeEntryData } from "../../common/types/types";

const EntrySidebarExtension = () => {
  interface Option {
    label: string;
    value: string;
  }

  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const [entryData, setEntryData] = useState<TypeEntryData>({ title: "", uid: "" });
  const [state, setState] = useState<TypeSDKData>({
    config: {},
    location: {},
    appSdkInitialized: false,
  });

  useEffect(() => {
    ContentstackAppSdk.init().then(async (appSdk) => {
      const config = await appSdk?.getConfig();

      const entryDataFromSDK = appSdk?.location?.SidebarWidget?.entry?.getData();
      setEntryData(entryDataFromSDK); // entryData is the whole entry object from CMS that contains all the data in the current entry for which sidebar is opened.
      setState({
        config,
        location: appSdk.location,
        appSdkInitialized: true,
      });
    });
  }, []);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get("https://cdn.contentstack.io/v3/content_types/property_detail_page/entries", {
          headers: {
            api_key: "blt7b5a000894312482",
            access_token: "csf3094e76b49ecf2e7a12156a",
          },
        });

        console.log(response);

        // Map the entry titles to options labels
        const fetchedOptions = response.data.entries.map((entry: any) => ({
          label: entry.title,
          value: entry.uid,
        }));

        setOptions(fetchedOptions);
      } catch (error) {
        console.error("Error fetching entries:", error);
        // Handle the error case
      }
    };

    fetchEntries();
  }, []);

  const handleDropdownChange = (selectedOption: Option | null) => {
    setSelectedOption(selectedOption);
  };

  console.log(entryData);

  const handleGenerateVariation = () => {
    if (selectedOption) {
      const queryParams = new URLSearchParams();
      queryParams.append("selectedOption", selectedOption.value);
      queryParams.append("sourceOption", entryData.uid);

      const url =
        "https://app.contentstack.com/automations-api/run/a931b057b9a14fc1866e3a5aa25ffbf5?" + queryParams.toString();

      axios
        .get(url)
        .then((response) => {
          response.data = selectedOption.value;
          console.log("HTTP request successful:", response.data);
          setConfirmation(true);
        })
        .catch((error) => {
          console.error("HTTP request failed:", error);
          // Handle the error case
        });
    }
  };

  return (
    <div className="entry-sidebar">
      <div className="entry-sidebar-container">
        {!confirmation && (
          <div className="container-1">
            <Select
              selectLabel="Select an existing property listing to create a variation:"
              options={options}
              onChange={handleDropdownChange}
              isMulti={false}
              isClearable={false}
              value={selectedOption}
              placeholder="Select a listing"
              width="200px"
            />
            <Button buttonType="primary" onClick={handleGenerateVariation}>
              Generate Variation
            </Button>
            <br />
          </div>
        )}
        {confirmation && <h2 style={{ color: "green", marginTop: "10px" }}>Variation generated successfully!</h2>}
      </div>
    </div>
  );
};

export default EntrySidebarExtension;
