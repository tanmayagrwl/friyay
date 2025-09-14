
'use client';
import { useState, RefObject } from 'react';
import html2canvas from 'html2canvas-pro';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { useScheduleStore } from '@/store/schedule-store';

interface ImageExportButtonProps {
  exportRef: RefObject<HTMLDivElement>;
}

export function ImageExportButton({ exportRef }: ImageExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const activePlan = useScheduleStore((state) => state.getActivePlan());

  const handleExportAsImage = async () => {

    if (!exportRef.current) {
      console.error("Export target not found.");
      return;
    }
    
    setIsExporting(true);
    
    try {

      const canvas = await html2canvas(exportRef.current, {
        scale: 2, 
        useCORS: true, 
        backgroundColor: document.documentElement.classList.contains('dark') ? '#020817' : '#FFFFFF',
      });


      const imageData = canvas.toDataURL('image/png');


      const link = document.createElement('a');
      link.href = imageData;
      link.download = `friyay-plan.png`;
      

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Failed to export image:", error);

    } finally {

      setIsExporting(false);
    }
  };


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