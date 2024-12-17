import requests
from bs4 import BeautifulSoup
import csv

# Step 1: Fetch the HTML page
url = "https://learn.microsoft.com/en-us/windows/win32/debug/system-error-codes--9000-11999-"
response = requests.get(url)
html_content = response.content

# Step 2: Parse the HTML using BeautifulSoup
soup = BeautifulSoup(html_content, "html.parser")

# Step 3: Define the structure to store extracted data
error_codes = []

# Step 4: Locate the error code section
for error in soup.find_all("p"):
    strong_tag = error.find("strong")
    if strong_tag:
        code_name = strong_tag.text  # e.g., ERROR_SUCCESS
        code_hex = error.find_next_sibling("p").text if error.find_next_sibling("p") else None
        description = error.find_next_sibling("p").find_next_sibling("p").text if error.find_next_sibling("p").find_next_sibling("p") else None
        
        # Store extracted data
        error_codes.append([code_name, code_hex, description])

# Step 5: Write the data to a CSV file
csv_filename = "Web_Scraping/errors_csv/system_error_code-9000-11999.csv"
with open(csv_filename, mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["Error Code Name", "Hex Code", "Description"])  # Column headers
    writer.writerows(error_codes)

print(f"Data successfully saved to {csv_filename}")
