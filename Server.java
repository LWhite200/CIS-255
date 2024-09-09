package cis316;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

public class Server {

    // This will contain the word and the line number
    Set<String> uniques = new HashSet<>();

    public static void main(String[] args) {
        readFile();
    }

    private static void readFile() {
        int currLine = 0;
        String fileName = "Dictionary.txt";
        
        try (BufferedReader reader = new BufferedReader(new FileReader(fileName))) {
            String line;
            
            // Read the file line by line
            while ((line = reader.readLine()) != null) {
                
                String[] words = line.trim().split("\\s+"); // Splitting words
                if (words.length >= 2 ) System.out.println("Adding: (" + words[0] + ", " + currLine + ")");
                currLine++;
            }
        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());
        }
    }
}

