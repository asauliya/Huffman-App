#include <iostream>
#include <fstream>
#include <string>

int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cerr << "Usage: " << argv[0] << " <input_file> <output_file>\n";
        return 1;
    }

    std::cout<<argv[1]<<" "<<argv[2]<<std::endl;

    std::ifstream inputFile(argv[1]);
    std::ofstream outputFile(argv[2]);

    if (!inputFile.is_open() || !outputFile.is_open()) {
        std::cerr << "Error opening files\n";
        return 1;
    }

    std::string line;
    while (std::getline(inputFile, line)) {
        // Example processing: Convert text to uppercase
        for (char &c : line) {
            c = toupper(c);
        }
        outputFile << line << "\n";
    }

    inputFile.close();
    outputFile.close();

    std::cout << "Processing complete.\n";
    return 0;
}
