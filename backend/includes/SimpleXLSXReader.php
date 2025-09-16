<?php
/**
 * SimpleXLSX Reader
 * کتابخانه ساده برای خواندن فایل‌های Excel
 */

class SimpleXLSXReader {
    
    public static function readFile($filename) {
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        
        if ($extension === 'csv') {
            return self::readCSV($filename);
        } elseif (in_array($extension, ['xlsx', 'xls'])) {
            return self::readExcel($filename);
        } else {
            throw new Exception('Unsupported file format');
        }
    }
    
    private static function readCSV($filename) {
        $data = [];
        $handle = fopen($filename, 'r');
        
        if ($handle !== FALSE) {
            while (($row = fgetcsv($handle, 1000, ',', '"', '\\')) !== FALSE) {
                $data[] = $row;
            }
            fclose($handle);
        }
        
        return $data;
    }
    
    private static function readExcel($filename) {
        // برای سادگی، از XML parser ساده استفاده می‌کنیم
        // در production باید از کتابخانه‌های مناسب مثل PhpSpreadsheet استفاده کرد
        
        if (!file_exists($filename)) {
            throw new Exception('File not found');
        }
        
        // اگر فایل xlsx است، آن را zip extract می‌کنیم
        if (strtolower(pathinfo($filename, PATHINFO_EXTENSION)) === 'xlsx') {
            return self::readXLSX($filename);
        }
        
        // برای xls از روش دیگری استفاده می‌کنیم
        throw new Exception('XLS format not supported in this simple implementation');
    }
    
    private static function readXLSX($filename) {
        $zip = new ZipArchive;
        
        if ($zip->open($filename) === TRUE) {
            // خواندن sharedStrings
            $sharedStrings = [];
            if ($zip->locateName('xl/sharedStrings.xml') !== false) {
                $sharedStringsXML = $zip->getFromName('xl/sharedStrings.xml');
                $xml = simplexml_load_string($sharedStringsXML);
                if ($xml) {
                    foreach ($xml->si as $val) {
                        if (isset($val->t)) {
                            $sharedStrings[] = (string)$val->t;
                        } else if (isset($val->r)) {
                            $text = '';
                            foreach ($val->r as $r) {
                                if (isset($r->t)) {
                                    $text .= (string)$r->t;
                                }
                            }
                            $sharedStrings[] = $text;
                        }
                    }
                }
            }
            
            // خواندن worksheet
            $worksheetXML = $zip->getFromName('xl/worksheets/sheet1.xml');
            $xml = simplexml_load_string($worksheetXML);
            
            $data = [];
            if ($xml && $xml->sheetData) {
                foreach ($xml->sheetData->row as $row) {
                    $rowData = [];
                    foreach ($row->c as $cell) {
                        $value = '';
                        if (isset($cell->v)) {
                            if (isset($cell['t']) && $cell['t'] == 's') {
                                // Shared string
                                $index = (int)$cell->v;
                                $value = isset($sharedStrings[$index]) ? $sharedStrings[$index] : '';
                            } else {
                                $value = (string)$cell->v;
                            }
                        }
                        $rowData[] = $value;
                    }
                    $data[] = $rowData;
                }
            }
            
            $zip->close();
            return $data;
        } else {
            throw new Exception('Cannot open XLSX file');
        }
    }
}
?>