"use server";
import * as cheerio from 'cheerio';

interface StudentResult {
  rollNumber: string;
  studentName: string;
  subjects: Array<{ subject: string; mark: number }>;
  totalPercentage: number;
  finalStatus: string;
}

export async function getStudentResult(
  formData: FormData
): Promise<StudentResult> {
  const rollNumber = formData.get("rollNumber")?.toString();

  if (!rollNumber) {
    throw new Error("Roll Number is required");
  }

  try {
    const res = await fetch(
      `https://soneb.gov.so/natiijada_ardayga_list.php?q=(RollNumber~equals~${rollNumber})`
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch results: ${res.status} ${res.statusText}`
      );
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Extract student name
    const studentName = $("#edit4_StudentName").text().trim();
    if (!studentName) {
      throw new Error("Student not found");
    }

    // Extract subjects and marks
    const subjects: Array<{ subject: string; mark: number }> = [];
    const subjectRows = $("table.bs-fieldsgrid tr");

    subjectRows.each((index, element) => {
      const tds = $(element).find("td");
      if (tds.length >= 4) {
        const subject1Td = $(tds[0]);
        const mark1Td = $(tds[1]);
        const subject1 = subject1Td.text().trim();
        const mark1Text = mark1Td.text().trim();
        const mark1 = parseFloat(mark1Text);
        if (subject1 && !isNaN(mark1)) {
          subjects.push({ subject: subject1, mark: mark1 });
        }

        const subject2Td = $(tds[2]);
        const mark2Td = $(tds[3]);
        const subject2 = subject2Td.text().trim();
        const mark2Text = mark2Td.text().trim();
        const mark2 = parseFloat(mark2Text);
        if (subject2 && !isNaN(mark2)) {
          subjects.push({ subject: subject2, mark: mark2 });
        }
      } else if (tds.length >= 2 && subjects.length < 10) {
        const subjectTd = $(tds[0]);
        const markTd = $(tds[1]);
        const subject = subjectTd.text().trim();
        const markText = markTd.text().trim();
        const mark = parseFloat(markText);
        if (subject && !isNaN(mark)) {
          subjects.push({ subject, mark });
        }
      }
    });

    if (subjects.length === 0) {
      throw new Error("No subjects found for this student");
    }

    // Extract percentage
    const percentageText = $("#edit4_Celceliska").text().trim();
    const percentage = parseFloat(percentageText.replace("%", ""));
    if (isNaN(percentage)) {
      throw new Error("Invalid percentage data");
    }

    // Extract final status
    const status = $("#edit4_Natiijada").text().trim();
    if (!status) {
      throw new Error("No status found for this student");
    }

    return {
      rollNumber,
      studentName,
      subjects,
      totalPercentage: percentage,
      finalStatus: status,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch student results: ${error.message}`);
    }
    throw new Error(
      "An unexpected error occurred while fetching student results"
    );
  }
}
