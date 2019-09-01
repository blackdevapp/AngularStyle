import * as html2canvas from "html2canvas"
import * as jsPDF from 'jspdf'


export class Print {
    public static PDF(name, document, scale) {
        const filename = name + '.pdf';
        
        // pdf.internal.scaleFactor = 2.25;
        html2canvas(document,
            { scale: scale }).then(canvas => {
                let pdf = new jsPDF('p', 'mm', 'a4');
                // pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
                pdf.save(filename);
            });
    }
}