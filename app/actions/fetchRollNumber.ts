"use server";
import * as cheerio from 'cheerio';

interface StudentResult {
  rollNumber: string;
  studentName: string;
  subjects: Array<{ subject: string; mark: string | number }>;
  totalPercentage: string | number;
  finalStatus: string;
}

// Helper function to determine if roll number is from 2022 or later
function is2022OrLater(rollNumber: string): boolean {
  return (
    rollNumber.startsWith("22") ||
    rollNumber.startsWith("23") ||
    rollNumber.startsWith("24")
  );
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

    // Check if the response contains the "not found" message
    const notFoundMessage = $("[data-grid-message]").text().trim();
    if (notFoundMessage === "Xog lamasoo helin.") {
      throw new Error("Student not found");
    }

    // Extract student name
    const studentName = $("#edit4_StudentName").text().trim();
    if (!studentName) {
      throw new Error("Student not found");
    }

    // Extract subjects and marks
    const subjects: Array<{ subject: string; mark: string | number }> = [];
    const subjectRows = $("table.bs-fieldsgrid tr");
    const isNewFormat = is2022OrLater(rollNumber);

    subjectRows.each((index, element) => {
      const tds = $(element).find("td");
      if (tds.length >= 4) {
        const subject1Td = $(tds[0]);
        const mark1Td = $(tds[1]);
        const subject1 = subject1Td.text().trim();
        const mark1Text = mark1Td.text().trim();

        if (subject1) {
          if (isNewFormat) {
            subjects.push({ subject: subject1, mark: mark1Text });
          } else {
            const mark1 = parseFloat(mark1Text);
            if (!isNaN(mark1)) {
              subjects.push({ subject: subject1, mark: mark1 });
            }
          }
        }

        const subject2Td = $(tds[2]);
        const mark2Td = $(tds[3]);
        const subject2 = subject2Td.text().trim();
        const mark2Text = mark2Td.text().trim();

        if (subject2) {
          if (isNewFormat) {
            subjects.push({ subject: subject2, mark: mark2Text });
          } else {
            const mark2 = parseFloat(mark2Text);
            if (!isNaN(mark2)) {
              subjects.push({ subject: subject2, mark: mark2 });
            }
          }
        }
      } else if (tds.length >= 2 && subjects.length < 10) {
        const subjectTd = $(tds[0]);
        const markTd = $(tds[1]);
        const subject = subjectTd.text().trim();
        const markText = markTd.text().trim();

        if (subject) {
          if (isNewFormat) {
            subjects.push({ subject, mark: markText });
          } else {
            const mark = parseFloat(markText);
            if (!isNaN(mark)) {
              subjects.push({ subject, mark });
            }
          }
        }
      }
    });

    if (subjects.length === 0) {
      throw new Error("No subjects found for this student");
    }

    // Extract percentage/grade
    const percentageText = $("#edit4_Celceliska").text().trim();
    let totalPercentage: string | number;

    if (isNewFormat) {
      totalPercentage = percentageText; // Keep as letter grade for new format
    } else {
      const percentage = parseFloat(percentageText.replace("%", ""));
      if (isNaN(percentage)) {
        throw new Error("Invalid percentage data");
      }
      totalPercentage = percentage;
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
      totalPercentage,
      finalStatus: status,
    };
  } catch (error) {
    if (error instanceof Error) {
      // If the error is "Student not found", throw it as is
      if (error.message === "Student not found") {
        throw error;
      }
      throw new Error(`Failed to fetch student results: ${error.message}`);
    }
    throw new Error(
      "An unexpected error occurred while fetching student results"
    );
  }
}
