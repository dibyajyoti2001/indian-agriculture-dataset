// Importing Table component from Mantine core library
import { Table } from "@mantine/core";
// Importing avgCropProduction css to used that properties
import "./styles/avgCropProduction.css";
import { useEffect, useState } from "react";
import config from "../config/config";

// Defining the interface for CropData
interface CropData {
  "Crop Name": string;
  "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": number | string;
  "Area Under Cultivation (UOM:Ha(Hectares))": number | string;
}

// Defining the interface for processed Element data
interface Element {
  crop: string;
  avgYieldCrop: number;
  avgCultivationCrop: number;
}

function AvgCropProduction() {
  // Declaring state variable 'data' with an empty array as its initial value
  const [data, setData] = useState<Element[]>([]);

  // Using useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchDataSet();
  }, []);

  // Function to fetch data from the server
  const fetchDataSet = async () => {
    try {
      // Making a GET request to the server URL
      const response = await fetch(config.serverUrl);
      if (response.status === 200) {
        // Parsing the response data as JSON
        const dataSet: CropData[] = await response.json();
        // Processing the data
        const processedData = processCropData(dataSet);
        // Updating the state with processed data
        setData(processedData);
      }
    } catch (error: any) {
      // Displaying an alert in case of an error
      alert(error.message);
    }
  };

  // Function to process the fetched data
  const processCropData = (dataSet: CropData[]): Element[] => {
    // Creating a map to store yield and area data for each crop
    const cropToDataMap: {
      [crop: string]: { yield: number[]; area: number[] };
    } = {};

    // Iterating through the data set
    dataSet.forEach((crop) => {
      const cropName = crop["Crop Name"];
      const yieldValue = crop["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"]
        ? parseFloat(
            crop["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"] as string
          )
        : 0;
      const areaValue = crop["Area Under Cultivation (UOM:Ha(Hectares))"]
        ? parseFloat(
            crop["Area Under Cultivation (UOM:Ha(Hectares))"] as string
          )
        : 0;

      // Initializing the crop data if not already present
      if (!cropToDataMap[cropName]) {
        cropToDataMap[cropName] = { yield: [], area: [] };
      }
      // Adding yield and area values to the crop data
      cropToDataMap[cropName].yield.push(yieldValue);
      cropToDataMap[cropName].area.push(areaValue);
    });

    // Creating an array of elements with average yield and area values
    const elements: Element[] = Object.entries(cropToDataMap).map(
      ([crop, data]) => {
        const avgYield =
          data.yield.reduce((sum, value) => sum + value, 0) / data.yield.length;
        const avgArea =
          data.area.reduce((sum, value) => sum + value, 0) / data.area.length;

        return {
          crop: crop,
          avgYieldCrop: avgYield,
          avgCultivationCrop: avgArea,
        };
      }
    );

    return elements;
  };

  // Creating table rows with the processed data
  const rows = data.map((element) => (
    <Table.Tr key={element.crop}>
      <Table.Td>{element.crop}</Table.Td>
      <Table.Td>{element.avgYieldCrop.toFixed(3)}</Table.Td>
      <Table.Td>{element.avgCultivationCrop.toFixed(3)}</Table.Td>
    </Table.Tr>
  ));

  return (
    // Rendering the table with the processed data
    <Table className="table-container">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Crop</Table.Th>
          <Table.Th>
            Average Yield of the
            <br />
            Crop between
            <br />
            1950-2020
          </Table.Th>
          <Table.Th>
            Average Cultivation Area
            <br />
            of the Crop between
            <br />
            1950-2020
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

export default AvgCropProduction;
