import { Button } from "@/components/ui/button";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-4 gap-2">
      <Button
        size="sm"
        variant="outline"
        className="cursor-pointer"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </Button>
      {[...Array(totalPages)].map((_, idx) => (
        <Button
          key={idx}
          size="sm"
          variant={currentPage === idx + 1 ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onPageChange(idx + 1)}
        >
          {idx + 1}
        </Button>
      ))}
      <Button
        size="sm"
        variant="outline"
        className="cursor-pointer"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;