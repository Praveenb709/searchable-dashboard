
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import SearchPanel from "@/components/SearchPanel";
import DataTable from "@/components/DataTable";
import { searchData, type SearchField, type SearchParams } from "@/utils/api";
import { LayoutDashboard, LogOut, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    data: any[];
    total: number;
  }>({ data: [], total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchParams, setSearchParams] = useState<{
    district?: string;
    mandal?: string;
    searchField?: SearchField;
    searchTerm?: string;
  }>({});

  const pageSize = 10;

  const handleSearch = async (params: {
    district?: string;
    mandal?: string;
    searchField?: SearchField;
    searchTerm?: string;
  }) => {
    setIsSearching(true);
    setSearchParams(params);
    setCurrentPage(1);
    setHasSearched(true);

    try {
      const searchParams: SearchParams = {
        ...params,
        page: 1,
        pageSize,
      };

      const results = await searchData(searchParams);
      setSearchResults(results);
      
      const filterCount = [
        params.district, 
        params.mandal, 
        params.searchField && params.searchTerm
      ].filter(Boolean).length;
      
      if (filterCount > 0) {
        toast.success(`Search complete`, {
          description: `Found ${results.total} results matching your criteria`,
        });
      }
    } catch (error) {
      toast.error("Search failed", {
        description: "There was an error processing your search. Please try again.",
      });
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setIsSearching(true);
    setCurrentPage(page);

    try {
      const searchParams: SearchParams = {
        ...searchParams,
        page,
        pageSize,
      };

      const results = await searchData(searchParams);
      setSearchResults(results);
    } catch (error) {
      toast.error("Failed to load page", {
        description: "There was an error loading the page. Please try again.",
      });
      console.error("Page change error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-slate-900">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/4 bottom-1/3 w-96 h-96 bg-blue-400/10 rounded-full filter blur-3xl" />
        <div className="absolute right-1/3 top-1/4 w-80 h-80 bg-indigo-400/10 rounded-full filter blur-3xl" />
      </div>
      
      {/* Header */}
      <header className="glass-card border-b sticky top-0 z-30 px-4 sm:px-6 h-16">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Search Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card w-56 mt-1">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled className="flex justify-between">
                  <span>Username</span>
                  <span className="font-medium">{user.username}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto py-8 px-4 sm:px-6 relative z-10 animate-fade-in">
        <div className="space-y-1 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Data Search</h1>
          <p className="text-muted-foreground">
            Search and filter data across districts and mandals
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Search panel */}
          <SearchPanel onSearch={handleSearch} isSearching={isSearching} />
          
          {/* Search results */}
          {hasSearched && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Search Results</h2>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Search className="h-4 w-4 mr-2" />
                  <span>
                    {searchResults.total} {searchResults.total === 1 ? "result" : "results"} found
                  </span>
                </div>
              </div>
              
              <DataTable
                data={searchResults.data}
                isLoading={isSearching}
                page={currentPage}
                pageSize={pageSize}
                totalItems={searchResults.total}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Search Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
