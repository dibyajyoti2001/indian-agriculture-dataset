// Importing the Table component from the @mantine/core library
import { Table } from "@mantine/core";
// Importing the maxCropProduction css to use the css properties
import "./styles/maxCropProduction.css";
// Importing React hooks for managing state and side effects
import { useEffect, useState } from "react";
// Importing configuration details
import config from "../config/config";

// Defining an interface for the structure of crop data
interface CropData {
  Year: string;
  "Crop Production (UOM:t(Tonnes))": number | string; // Production amount in tonnes
}

// Defining an interface for the structure of processed data elements
interface Element {
  year: number; // Year of production
  maxCrop: number; // Maximum crop production in that year
  minCrop: number; // Minimum crop production in that year
}

// Functional component for displaying maximum crop production data
function MaxCropProduction() {
  // Declaring state to hold the processed crop data
  const [data, setData] = useState<Element[]>([]);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchDataSet();
  }, []);

  // Function to fetch the crop data from the server
  const fetchDataSet = async () => {
    try {
      // Fetching data from the server using the URL from the config
      const response = await fetch(config.serverUrl);
      if (response.status === 200) {
        // Parsing the response data if the request is successful
        const dataSet: CropData[] = await response.json();
        // Processing the fetched data
        const processedData = processCropData(dataSet);
        // Updating the state with the processed data
        setData(processedData);
      }
    } catch (error: any) {
      // Alerting the user if there is an error during fetch
      alert(error.message);
    }
  };

  // Function to process the raw crop data into a structured format
  const processCropData = (dataSet: CropData[]): Element[] => {
    // Creating a map to store crop productions by year
    const yearToCropsMap: { [year: number]: number[] } = {};

    dataSet.forEach((crop) => {
      // Extracting the year from the crop data
      const year = parseInt(crop.Year.split(",")[1].trim(), 10);
      // Extracting the production amount and converting it to a number
      const production = crop["Crop Production (UOM:t(Tonnes))"]
        ? parseFloat(crop["Crop Production (UOM:t(Tonnes))"] as string)
        : 0;
      // Initializing the year's crop array if it doesn't exist
      if (!yearToCropsMap[year]) {
        yearToCropsMap[year] = [];
      }
      // Adding the production amount to the year's crop array
      yearToCropsMap[year].push(production);
    });

    // Transforming the year-to-crops map into an array of Element objects
    const elements: Element[] = Object.entries(yearToCropsMap).map(
      ([year, productions]) => {
        // Calculating the maximum and minimum production for the year
        const maxCrop = Math.max(...productions);
        const minCrop = Math.min(...productions);

        // Returning an Element object for that year with max & min crop
        return {
          year: parseInt(year, 10),
          maxCrop: maxCrop,
          minCrop: minCrop,
        };
      }
    );

    // Returning the array of Element objects
    return elements;
  };

  // Creating table rows from the processed data
  const rows = data.map((element) => (
    <Table.Tr key={element.year}>
      <Table.Td>{element.year}</Table.Td>
      <Table.Td>{element.maxCrop}</Table.Td>
      <Table.Td>{element.minCrop}</Table.Td>
    </Table.Tr>
  ));

  return (
    // Rendering the table with the processed data
    <Table className="table-container">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Year</Table.Th>
          <Table.Th>
            Crop with Maximum
            <br />
            Production in that Year
          </Table.Th>
          <Table.Th>
            Crop with Minimum
            <br />
            Production in that Year
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}

export default MaxCropProduction;
