// src/components/image-export-button.tsx
'use client';

import { useState, RefObject } from 'react';
import html2canvas from 'html2canvas-pro';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { useScheduleStore } from '@/store/schedule-store';

interface ImageExportButtonProps {
  // We'll pass a ref from the parent component that points to the schedule container
  exportRef: RefObject<HTMLDivElement>;
}

export function ImageExportButton({ exportRef }: ImageExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const activePlan = useScheduleStore((state) => state.getActivePlan());

  const handleExportAsImage = async () => {
    // Check if the ref is attached to an element
    if (!exportRef.current) {
      console.error("Export target not found.");
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Use html2canvas to render the element
      const canvas = await html2canvas(exportRef.current, {
        scale: 2, // Render at 2x resolution for better quality
        useCORS: true, // Important if you ever use external images
        // Set a background color, as the default root is transparent.
        // This helps ensure dark mode captures have a dark background.
        backgroundColor: document.documentElement.classList.contains('dark') ? '#020817' : '#FFFFFF',
      });

      // Convert the canvas to a PNG image data URL
      const imageData = canvas.toDataURL('image/png');

      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `weekendly-plan.png`;
      
      // Programmatically click the link to start the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Failed to export image:", error);
      // You could show an error toast to the user here
    } finally {
      // Ensure the loading state is turned off, even if there's an error
      setIsExporting(false);
    }
  };

  // Don't render the button if there's no plan to export
  if (!activePlan) {
    return null;
  }

  return (
    <Button variant="outline" onClick={handleExportAsImage} disabled={isExporting}>
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Capturing...
        </>
      ) : (
        <>
          <ImageIcon className="h-4 w-4 mr-2" />
          Save as Image
        </>
      )}
    </Button>
  );
}