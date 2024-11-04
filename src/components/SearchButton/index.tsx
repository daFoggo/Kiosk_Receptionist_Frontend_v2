import { useState, useEffect, useCallback, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { searchVariants } from "./motion";
import {
  IDesktopSearchProps,
  IMobileSearchProps,
} from "@/models/SearchButton/type";

const DesktopSearch = memo(
  ({
    searchValue,
    isOpen,
    setIsOpen,
    handleChange,
    handleSubmit,
    handleClose,
    placeholder,
  }: IDesktopSearchProps) => {
    if (!isOpen) {
      return (
        <Button
          variant="outline"
          size="icon"
          className="font-semibold rounded-full hover:scale-110 hover:bg-primary hover:text-white transition-transform duration-200"
          onClick={() => setIsOpen(true)}
        >
          <Search className="h-4 w-4" />
        </Button>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="search-form"
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex items-center"
        >
          <motion.div variants={searchVariants} className="relative">
            <Input
              type="text"
              placeholder={placeholder}
              value={searchValue}
              onChange={handleChange}
              className="w-full pr-8 rounded-full text-gray-500 border-gray-300 focus-visible:ring-offset-0"
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 hover:bg-transparent"
              onClick={() => {
                setIsOpen(false);
                handleClose();
              }}
            >
              <X className="h-4 w-4 text-gray-500 hover:text-gray-600" />
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1 }}
          >
            <Button
              type="submit"
              size="icon"
              className="ml-2 rounded-full hover:scale-110 transition-transform duration-200"
              onClick={handleSubmit}
            >
              <Search className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }
);

const MobileSearch = memo(
  ({
    searchValue,
    handleChange,
    handleSubmit,
    handleClose,
    placeholder,
  }: IMobileSearchProps) => (
    <form onSubmit={handleSubmit} className="flex items-center w-full">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleChange}
          className="w-full pr-8 rounded-full text-gray-500 border-gray-300 focus-visible:ring-offset-0"
        />
        {searchValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 hover:bg-transparent"
            onClick={handleClose}
          >
            <X className="h-4 w-4 text-gray-500 hover:text-gray-600" />
          </Button>
        )}
      </div>
      <Button
        type="submit"
        size="icon"
        className="ml-2 rounded-full hover:scale-110 bg-primary transition-transform duration-200"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  )
);

const SearchButton = ({
  placeholder = "Tìm kiếm...",
  onSearch = (value: string) => console.log(value),
  className = "",
  debounceTime = 300,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onSearch(searchValue);
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [searchValue, onSearch, debounceTime]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(searchValue);
    },
    [onSearch, searchValue]
  );

  const handleClose = useCallback(() => {
    setSearchValue("");
    onSearch("");
  }, [onSearch]);

  return (
    <div className={`relative ${className}`}>
      <div className="block md:hidden">
        <MobileSearch
          searchValue={searchValue}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleClose={handleClose}
          placeholder={placeholder}
        />
      </div>
      <div className="hidden md:block">
        <DesktopSearch
          searchValue={searchValue}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleClose={handleClose}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default SearchButton;
