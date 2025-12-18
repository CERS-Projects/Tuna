import { SearchBar } from "@/components/ui/search/search";
import {
  SearchFilter,
  type NodeItem,
} from "@/features/search/components/searchFilter";

const exampleFlatData: NodeItem[] = [
  { id: 1, name: "a", classid: 0 },
  { id: 2, name: "b", classid: 1 },
  { id: 3, name: "c", classid: 1 },
  { id: 4, name: "d", classid: 2 },
  { id: 5, name: "e", classid: 2 },
  { id: 6, name: "a", classid: 3 },
  { id: 7, name: "b", classid: 5 },
  { id: 8, name: "c", classid: 6 },
  { id: 9, name: "d", classid: 1 },
  { id: 10, name: "e", classid: 9 },
];

const Test = () => {
  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test page.</p>
      <SearchBar />
      <SearchFilter flatData={exampleFlatData} />
    </div>
  );
};

export default Test;
