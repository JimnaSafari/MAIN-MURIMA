import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry 
}: ErrorMessageProps) => {
  return (
    <Alert variant="destructive" className="m-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="underline hover:no-underline ml-4"
          >
            Retry
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
};