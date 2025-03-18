
import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  fetchDistricts,
  fetchMandals,
  getSearchFields,
  type District,
  type Mandal,
  type SearchField,
} from "@/utils/api";

interface SearchPanelProps {
  onSearch: (params: {
    district?: string;
    mandal?: string;
    searchField?: SearchField;
    searchTerm?: string;
  }) => void;
  isSearching: boolean;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ onSearch, isSearching }) => {
  // State for form data
  const [district, setDistrict] = useState<string | undefined>();
  const [mandal, setMandal] = useState<string | undefined>();
  const [searchField, setSearchField] = useState<SearchField | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // State for dropdown options
  const [districts, setDistricts] = useState<District[]>([]);
  const [mandals, setMandals] = useState<Mandal[]>([]);
  const searchFields = getSearchFields();
  
  // Loading states
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingMandals, setIsLoadingMandals] = useState(false);

  // Fetch districts on component mount
  useEffect(() => {
    const getDistricts = async () => {
      setIsLoadingDistricts(true);
      try {
        const data = await fetchDistricts();
        setDistricts(data);
      } catch (error) {
        console.error("Failed to fetch districts:", error);
      } finally {
        setIsLoadingDistricts(false);
      }
    };

    getDistricts();
  }, []);

  // Fetch mandals when district changes
  useEffect(() => {
    const getMandals = async () => {
      if (!district) {
        setMandals([]);
        setMandal(undefined);
        return;
      }

      setIsLoadingMandals(true);
      try {
        const data = await fetchMandals(district);
        setMandals(data);
        setMandal(undefined); // Reset mandal selection when district changes
      } catch (error) {
        console.error("Failed to fetch mandals:", error);
      } finally {
        setIsLoadingMandals(false);
      }
    };

    getMandals();
  }, [district]);

  // Handle search submission
  const handleSearch = () => {
    if (!searchField && searchTerm) {
      toast.warning("Please select a search field", {
        description: "A search field is required when entering a search term",
      });
      return;
    }

    if (searchField && !searchTerm) {
      toast.warning("Please enter a search term", {
        description: "A search term is required when a search field is selected",
      });
      return;
    }

    onSearch({
      district,
      mandal,
      searchField,
      searchTerm: searchTerm || undefined,
    });
  };

  // Handle search reset
  const handleReset = () => {
    setDistrict(undefined);
    setMandal(undefined);
    setSearchField(undefined);
    setSearchTerm("");
    
    onSearch({
      district: undefined,
      mandal: undefined,
      searchField: undefined,
      searchTerm: undefined,
    });
    
    toast.info("Search filters reset");
  };

  return (
    <div className="glass-card rounded-xl p-6 transition-all duration-300 animate-slide-up">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="district">District</Label>
            <Select
              value={district}
              onValueChange={setDistrict}
              disabled={isLoadingDistricts}
            >
              <SelectTrigger id="district" className="glass-input">
                {isLoadingDistricts ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <SelectValue placeholder="Select a district" />
                )}
              </SelectTrigger>
              <SelectContent className="glass-card">
                {districts.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mandal">Mandal</Label>
            <Select
              value={mandal}
              onValueChange={setMandal}
              disabled={!district || isLoadingMandals}
            >
              <SelectTrigger id="mandal" className="glass-input">
                {isLoadingMandals ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <SelectValue placeholder={district ? "Select a mandal" : "Select a district first"} />
                )}
              </SelectTrigger>
              <SelectContent className="glass-card">
                {mandals.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/3 space-y-2">
            <Label htmlFor="searchField">Search By</Label>
            <Select
              value={searchField}
              onValueChange={(value) => setSearchField(value as SearchField)}
            >
              <SelectTrigger id="searchField" className="glass-input">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent className="glass-card">
                {searchFields.map((field) => (
                  <SelectItem key={field.value} value={field.value}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <Label htmlFor="searchTerm">Search Term</Label>
            <div className="relative">
              <Input
                id="searchTerm"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter search term"
                className="glass-input pl-10"
                disabled={!searchField}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isSearching}
            className="bg-white/50 hover:bg-white/70 backdrop-blur-sm"
          >
            Reset
          </Button>
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
