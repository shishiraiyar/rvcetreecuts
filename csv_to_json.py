import csv
import json

CSV_FILE = "data.csv"
JSON_FILE = "data.json"

def csv_to_json(csv_file, json_file):
    data = {}

    with open(csv_file, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            department = row["Department"].strip().lower()
            semester = f"{row['Semester'].strip()}"
            subject_name = row["Subject name"].strip()
            num_students = int(row["Number of students"])
            avg_reports = float(row["Average number of reports per student"])
            avg_pages = float(row["Average number of pages per report"])


            if department not in data:
                data[department] = {}

            if semester not in data[department]:
                data[department][semester] = {"subjects": []}


            data[department][semester]["subjects"].append({
                "name": subject_name,
                "num_students": num_students,
                "avg_reports_per_student": avg_reports,
                "avg_pages_per_report": avg_pages
            })

    with open(json_file, mode="w", encoding="utf-8") as json_out:
        json.dump(data, json_out, indent=4)

    print(f"Conversion successful! JSON saved to {json_file}")

csv_to_json(CSV_FILE, JSON_FILE)
