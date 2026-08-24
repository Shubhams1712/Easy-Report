import { SampleReport } from '../types';

export const SAMPLE_REPORTS: SampleReport[] = [
  {
    id: 'blood-metabolic-panel',
    title: 'Metabolic & Lipid Panel',
    fileName: 'blood_test_results.pdf',
    fileSize: '2.4 MB',
    category: 'Comprehensive Blood Work',
    description: 'Routine yearly metabolic panel and lipid profile checking glucose, kidneys, electrolytes, and cholesterol.',
    rawText: `PATIENT: JOHN DOE
DOB: 01/15/1980
DATE OF COLLECTION: 10/24/2023
TEST: COMPREHENSIVE METABOLIC PANEL & LIPID PANEL

TEST                RESULT      UNIT        REFERENCE RANGE
------------------------------------------------------------
GLUCOSE             88          mg/dL       70 - 99
BUN                 14          mg/dL       7 - 20
CREATININE          0.9         mg/dL       0.6 - 1.2
SODIUM              141         mmol/L      136 - 145
POTASSIUM           4.2         mmol/L      3.5 - 5.1
CHLORIDE            102         mmol/L      98 - 107
CARBON DIOXIDE      25          mmol/L      21 - 32
CALCIUM             9.5         mg/dL       8.6 - 10.3
PROTEIN, TOTAL      7.2         g/dL        6.1 - 8.1
ALBUMIN             4.5         g/dL        3.6 - 5.1

CHOLESTEROL, TOTAL  175         mg/dL       < 200
TRIGLYCERIDES       110         mg/dL       < 150
HDL CHOLESTEROL     55          mg/dL       > 40
LDL CHOLESTEROL     98          mg/dL       < 100

VITAMIN D, 25-OH    28          ng/mL       30 - 100  (L)

END OF REPORT`,
    analysis: {
      fileName: 'blood_test_results.pdf',
      fileSize: '2.4 MB',
      dateProcessed: 'Today',
      patientName: 'John Doe',
      dateOfCollection: '10/24/2023',
      testType: 'Comprehensive Metabolic Panel & Lipid Panel',
      glanceSummary: 'Your recent blood work indicates overall good health, with most markers falling within the expected ranges. However, there is one area that requires slight attention.',
      keyFindings: [
        {
          id: 'f1',
          name: 'Glucose Levels',
          value: '88 mg/dL',
          unit: 'mg/dL',
          referenceRange: '70 - 99 mg/dL',
          status: 'normal',
          statusLabel: 'Normal',
          explanation: 'Your fasting glucose is 88 mg/dL.',
          clinicalMeaning: 'This is excellent and indicates healthy blood sugar regulation and normal insulin sensitivity.',
          matchedRawSnippet: 'GLUCOSE             88          mg/dL       70 - 99',
        },
        {
          id: 'f2',
          name: 'Vitamin D (25-OH)',
          value: '28 ng/mL',
          unit: 'ng/mL',
          referenceRange: '30 - 100 ng/mL',
          status: 'slightly_low',
          statusLabel: 'Slightly Low',
          explanation: 'Your levels are 28 ng/mL (standard optimal is ≥30 ng/mL).',
          clinicalMeaning: 'This is very common, especially during winter months or for indoor workers. Vitamin D supports bone density and immune function.',
          matchedRawSnippet: 'VITAMIN D, 25-OH    28          ng/mL       30 - 100  (L)',
        },
        {
          id: 'f3',
          name: 'Cholesterol & Lipid Panel',
          value: 'Total 175, LDL 98, HDL 55',
          unit: 'mg/dL',
          referenceRange: '< 200, < 100, > 40',
          status: 'normal',
          statusLabel: 'Normal',
          explanation: 'Your total cholesterol is 175 mg/dL with healthy protective HDL.',
          clinicalMeaning: 'Your lipid panel shows healthy levels of LDL ("bad" cholesterol) and HDL ("good" cholesterol), indicating low cardiovascular risk.',
          matchedRawSnippet: 'CHOLESTEROL, TOTAL  175         mg/dL       < 200\nTRIGLYCERIDES       110         mg/dL       < 150',
        },
        {
          id: 'f4',
          name: 'Kidney Function (BUN & Creatinine)',
          value: 'Creatinine 0.9, BUN 14',
          unit: 'mg/dL',
          referenceRange: '0.6 - 1.2, 7 - 20',
          status: 'normal',
          statusLabel: 'Normal',
          explanation: 'Creatinine is 0.9 mg/dL and BUN is 14 mg/dL.',
          clinicalMeaning: 'Your kidneys are filtering waste efficiently with no signs of strain or dehydration.',
          matchedRawSnippet: 'BUN                 14          mg/dL       7 - 20\nCREATININE          0.9         mg/dL       0.6 - 1.2',
        },
        {
          id: 'f5',
          name: 'Electrolytes (Sodium, Potassium, Chloride)',
          value: 'Sodium 141, Potassium 4.2',
          unit: 'mmol/L',
          referenceRange: '136 - 145, 3.5 - 5.1',
          status: 'normal',
          statusLabel: 'Normal',
          explanation: 'Electrolyte balance is in steady equilibrium.',
          clinicalMeaning: 'Proper hydration, nerve signaling, and cardiac electrical conduction are well-supported.',
          matchedRawSnippet: 'SODIUM              141         mmol/L      136 - 145\nPOTASSIUM           4.2         mmol/L      3.5 - 5.1',
        },
      ],
      whatThisMeans: "You don't need to make any drastic changes based on these results. To address the slightly low Vitamin D, consider discussing a mild supplement (such as 1,000–2,000 IU D3) with your primary care provider, or safely increasing your sun exposure.",
      doctorQuestions: [
        'Should I start taking an over-the-counter Vitamin D3 supplement, and at what dosage?',
        'Do I need a repeat Vitamin D test in 3 to 6 months to check if it has normalized?',
        'Given my normal cholesterol numbers, do we maintain my current diet and exercise routine?',
      ],
      rawText: `PATIENT: JOHN DOE
DOB: 01/15/1980
DATE OF COLLECTION: 10/24/2023
TEST: COMPREHENSIVE METABOLIC PANEL & LIPID PANEL

TEST                RESULT      UNIT        REFERENCE RANGE
------------------------------------------------------------
GLUCOSE             88          mg/dL       70 - 99
BUN                 14          mg/dL       7 - 20
CREATININE          0.9         mg/dL       0.6 - 1.2
SODIUM              141         mmol/L      136 - 145
POTASSIUM           4.2         mmol/L      3.5 - 5.1
CHLORIDE            102         mmol/L      98 - 107
CARBON DIOXIDE      25          mmol/L      21 - 32
CALCIUM             9.5         mg/dL       8.6 - 10.3
PROTEIN, TOTAL      7.2         g/dL        6.1 - 8.1
ALBUMIN             4.5         g/dL        3.6 - 5.1

CHOLESTEROL, TOTAL  175         mg/dL       < 200
TRIGLYCERIDES       110         mg/dL       < 150
HDL CHOLESTEROL     55          mg/dL       > 40
LDL CHOLESTEROL     98          mg/dL       < 100

VITAMIN D, 25-OH    28          ng/mL       30 - 100  (L)

END OF REPORT`,
      category: 'blood',
    },
  },
  {
    id: 'cbc-panel',
    title: 'Complete Blood Count (CBC)',
    fileName: 'cbc_differential_report.pdf',
    fileSize: '1.8 MB',
    category: 'Hematology',
    description: 'Measures white blood cells, red blood cells, hemoglobin, hematocrit, and platelets.',
    rawText: `PATIENT: SARAH CONNER
DOB: 04/22/1988
DATE OF COLLECTION: 11/12/2023
TEST: COMPLETE BLOOD COUNT (CBC) WITH DIFFERENTIAL

TEST                RESULT      UNIT        REFERENCE RANGE
------------------------------------------------------------
WBC                 6.4         x10^3/uL    4.0 - 11.0
RBC                 4.15        x10^6/uL    3.80 - 5.20
HEMOGLOBIN          11.8        g/dL        12.0 - 16.0  (L)
HEMATOCRIT          35.2        %           37.0 - 48.0  (L)
MCV                 82.0        fL          80.0 - 100.0
MCH                 27.5        pg          27.0 - 33.0
MCHC                33.1        g/dL        32.0 - 36.0
RDW                 13.2        %           11.0 - 15.0
PLATELET COUNT      265         x10^3/uL    150 - 450
NEUTROPHILS %       58.0        %           40.0 - 74.0
LYMPHOCYTES %       32.0        %           19.0 - 48.0
MONOCYTES %         6.5         %           3.0 - 10.0
EOSINOPHILS %       2.8         %           0.0 - 6.0
BASOPHILS %         0.7         %           0.0 - 2.0

NOTES: MILD MICROCYTIC ANEMIA SUSPECTED.
END OF REPORT`,
    analysis: {
      fileName: 'cbc_differential_report.pdf',
      fileSize: '1.8 MB',
      dateProcessed: 'Today',
      patientName: 'Sarah Conner',
      dateOfCollection: '11/12/2023',
      testType: 'Complete Blood Count (CBC) with Differential',
      glanceSummary: 'Your blood count reveals mild borderline low hemoglobin and hematocrit, which indicates a mild form of anemia, while your immune cells and platelets are healthy.',
      keyFindings: [
        {
          id: 'f-hemoglobin',
          name: 'Hemoglobin & Hematocrit',
          value: '11.8 g/dL (Hgb) & 35.2% (Hct)',
          unit: 'g/dL & %',
          referenceRange: '12.0 - 16.0 g/dL',
          status: 'slightly_low',
          statusLabel: 'Borderline Low',
          explanation: 'Your oxygen-carrying protein (hemoglobin) is slightly below the 12.0 g/dL threshold.',
          clinicalMeaning: 'This suggests mild anemia, which can sometimes cause mild fatigue, cold hands, or lightheadedness.',
          matchedRawSnippet: 'HEMOGLOBIN          11.8        g/dL        12.0 - 16.0  (L)',
        },
        {
          id: 'f-wbc',
          name: 'White Blood Cells (WBC)',
          value: '6.4 x10^3/uL',
          unit: 'x10^3/uL',
          referenceRange: '4.0 - 11.0 x10^3/uL',
          status: 'normal',
          statusLabel: 'Normal',
          explanation: 'Your immune defense cells are right in the target zone.',
          clinicalMeaning: 'No signs of acute bacterial or viral infection or active inflammation.',
          matchedRawSnippet: 'WBC                 6.4         x10^3/uL    4.0 - 11.0',
        },
        {
          id: 'f-platelets',
          name: 'Platelet Count',
          value: '265 x10^3/uL',
          unit: 'x10^3/uL',
          referenceRange: '150 - 450 x10^3/uL',
          status: 'normal',
          statusLabel: 'Normal',
          explanation: 'Blood clotting cells are normal.',
          clinicalMeaning: 'Your blood has normal clotting ability with no elevated bleeding or abnormal clotting risks.',
          matchedRawSnippet: 'PLATELET COUNT      265         x10^3/uL    150 - 450',
        },
      ],
      whatThisMeans: 'Mild hemoglobin reduction is frequently related to dietary iron intake or monthly menstrual loss. You might benefit from an iron-rich diet (spinach, beans, lean meats) or a Ferritin blood test to check iron stores.',
      doctorQuestions: [
        'Could we order a Ferritin and Iron panel to confirm if this is iron-deficiency anemia?',
        'Would dietary adjustments be sufficient, or should I take an iron supplement?',
        'When should we repeat the CBC to verify recovery?',
      ],
      rawText: `PATIENT: SARAH CONNER
DOB: 04/22/1988
DATE OF COLLECTION: 11/12/2023
TEST: COMPLETE BLOOD COUNT (CBC) WITH DIFFERENTIAL

TEST                RESULT      UNIT        REFERENCE RANGE
------------------------------------------------------------
WBC                 6.4         x10^3/uL    4.0 - 11.0
RBC                 4.15        x10^6/uL    3.80 - 5.20
HEMOGLOBIN          11.8        g/dL        12.0 - 16.0  (L)
HEMATOCRIT          35.2        %           37.0 - 48.0  (L)
MCV                 82.0        fL          80.0 - 100.0
PLATELET COUNT      265         x10^3/uL    150 - 450
END OF REPORT`,
      category: 'blood',
    },
  },
  {
    id: 'thyroid-panel',
    title: 'Thyroid Function Panel',
    fileName: 'thyroid_tsh_panel.pdf',
    fileSize: '1.2 MB',
    category: 'Endocrinology',
    description: 'Evaluates thyroid gland performance via TSH, Free T4, and Free T3 levels.',
    rawText: `PATIENT: ROBERT CHEN
DOB: 08/09/1975
DATE OF COLLECTION: 01/18/2024
TEST: THYROID FUNCTION PROFILE

TEST                RESULT      UNIT        REFERENCE RANGE
------------------------------------------------------------
TSH                 2.15        uIU/mL      0.45 - 4.50
FREE T4             1.28        ng/dL       0.82 - 1.77
FREE T3             3.1         pg/mL       2.0 - 4.4
TPO ANTIBODIES      < 9         IU/mL       < 35

INTERPRETATION: EUTHYROID STATE. NORMAL THYROID AXIS.
END OF REPORT`,
    analysis: {
      fileName: 'thyroid_tsh_panel.pdf',
      fileSize: '1.2 MB',
      dateProcessed: 'Today',
      patientName: 'Robert Chen',
      dateOfCollection: '01/18/2024',
      testType: 'Thyroid Function Profile',
      glanceSummary: 'Your thyroid is functioning at optimal levels. All thyroid hormone regulatory markers are well within the standard healthy boundaries.',
      keyFindings: [
        {
          id: 'f-tsh',
          name: 'Thyroid Stimulating Hormone (TSH)',
          value: '2.15 uIU/mL',
          unit: 'uIU/mL',
          referenceRange: '0.45 - 4.50 uIU/mL',
          status: 'normal',
          statusLabel: 'Optimal',
          explanation: 'TSH is 2.15 uIU/mL (well centered in the reference span).',
          clinicalMeaning: 'Your pituitary gland and thyroid are communicating normally without overworking or underperforming.',
          matchedRawSnippet: 'TSH                 2.15        uIU/mL      0.45 - 4.50',
        },
        {
          id: 'f-freet4',
          name: 'Free T4 (Thyroxine)',
          value: '1.28 ng/dL',
          unit: 'ng/dL',
          referenceRange: '0.82 - 1.77 ng/dL',
          status: 'normal',
          statusLabel: 'Normal',
          explanation: 'Active circulating thyroid hormone is 1.28 ng/dL.',
          clinicalMeaning: 'Your metabolic rate, cellular energy production, and temperature regulation are properly supported.',
          matchedRawSnippet: 'FREE T4             1.28        ng/dL       0.82 - 1.77',
        },
      ],
      whatThisMeans: 'Your thyroid gland is healthy and functioning properly. Any non-specific symptoms such as fatigue, weight shifts, or brain fog are unlikely to be caused by a thyroid disorder.',
      doctorQuestions: [
        'Since my thyroid panel is normal, are there other metabolic checks we should evaluate for my overall energy?',
        'How often should routine thyroid screening be repeated?',
      ],
      rawText: `PATIENT: ROBERT CHEN
DOB: 08/09/1975
DATE OF COLLECTION: 01/18/2024
TEST: THYROID FUNCTION PROFILE

TEST                RESULT      UNIT        REFERENCE RANGE
------------------------------------------------------------
TSH                 2.15        uIU/mL      0.45 - 4.50
FREE T4             1.28        ng/dL       0.82 - 1.77
FREE T3             3.1         pg/mL       2.0 - 4.4
TPO ANTIBODIES      < 9         IU/mL       < 35
END OF REPORT`,
      category: 'blood',
    },
  },
];
