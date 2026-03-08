# Sample Schemes Data for DynamoDB

Use this JSON to populate your DynamoDB SchemesTable.

## Import Command

```bash
aws dynamodb batch-write-item --request-items file://schemes-data.json
```

## schemes-data.json

```json
{
  "BolBharat-Schemes": [
    {
      "PutRequest": {
        "Item": {
          "id": "PM_KISAN_001",
          "schemeId": "PM_KISAN_001",
          "name": "PM Kisan Samman Nidhi",
          "nameHindi": "पीएम किसान सम्मान निधि",
          "category": "Agriculture",
          "categoryHindi": "कृषि",
          "ministry": "Ministry of Agriculture & Farmers Welfare",
          "description": "Income support scheme providing ₹6,000 per year to all farmer families",
          "descriptionHindi": "सभी किसान परिवारों को प्रति वर्ष ₹6,000 प्रदान करने वाली आय सहायता योजना",
          "benefits": "₹2,000 per installment, 3 times per year",
          "benefitsHindi": "₹2,000 प्रति किस्त, वर्ष में 3 बार",
          "eligibility": [
            "Small and marginal farmers",
            "Land holding of up to 2 hectares",
            "Valid Aadhaar card"
          ],
          "eligibilityHindi": [
            "छोटे और सीमांत किसान",
            "2 हेक्टेयर तक की भूमि",
            "वैध आधार कार्ड"
          ],
          "requiredDocuments": [
            "Aadhaar Card",
            "Land ownership documents",
            "Bank account details"
          ],
          "applicationProcess": "Online application through PM-Kisan portal or Common Service Centers",
          "applicationDeadline": "Always Open",
          "website": "https://pmkisan.gov.in",
          "helpline": "155261 / 011-24300606"
        }
      }
    },
    {
      "PutRequest": {
        "Item": {
          "id": "PMFBY_001",
          "schemeId": "PMFBY_001",
          "name": "Pradhan Mantri Fasal Bima Yojana",
          "nameHindi": "प्रधानमंत्री फसल बीमा योजना",
          "category": "Agriculture",
          "categoryHindi": "कृषि",
          "ministry": "Ministry of Agriculture & Farmers Welfare",
          "description": "Crop insurance scheme to protect farmers against crop loss",
          "descriptionHindi": "फसल नुकसान के खिलाफ किसानों की रक्षा के लिए फसल बीमा योजना",
          "benefits": "Coverage up to ₹2 Lakh per farmer for crop damage",
          "benefitsHindi": "फसल क्षति के लिए प्रति किसान ₹2 लाख तक का कवरेज",
          "eligibility": [
            "All farmers including sharecroppers and tenant farmers",
            "Enrolled farmers with cultivable land"
          ],
          "requiredDocuments": [
            "Aadhaar Card",
            "Land records",
            "Bank account",
            "Sowing certificate"
          ],
          "applicationProcess": "Through banks, CSCs, or insurance company agents",
          "applicationDeadline": "Before sowing season",
          "website": "https://pmfby.gov.in",
          "helpline": "011-23382012"
        }
      }
    },
    {
      "PutRequest": {
        "Item": {
          "id": "AYUSHMAN_001",
          "schemeId": "AYUSHMAN_001",
          "name": "Ayushman Bharat - PM JAY",
          "nameHindi": "आयुष्मान भारत - पीएम जेएवाई",
          "category": "Healthcare",
          "categoryHindi": "स्वास्थ्य",
          "ministry": "Ministry of Health and Family Welfare",
          "description": "Health insurance providing ₹5 lakh coverage per family per year",
          "descriptionHindi": "प्रति परिवार प्रति वर्ष ₹5 लाख का कवरेज प्रदान करने वाला स्वास्थ्य बीमा",
          "benefits": "Free treatment at empanelled hospitals up to ₹5 Lakh annually",
          "benefitsHindi": "सूचीबद्ध अस्पतालों में वार्षिक ₹5 लाख तक मुफ्त उपचार",
          "eligibility": [
            "Families identified in SECC 2011",
            "Rural: D1-D7 categories",
            "Urban: 11 specified occupational categories"
          ],
          "requiredDocuments": [
            "Aadhaar Card",
            "Ration Card",
            "Mobile number"
          ],
          "applicationProcess": "Free e-cards issued at hospitals or through CSCs",
          "applicationDeadline": "Always Open",
          "website": "https://pmjay.gov.in",
          "helpline": "14555"
        }
      }
    },
    {
      "PutRequest": {
        "Item": {
          "id": "PMAY_G_001",
          "schemeId": "PMAY_G_001",
          "name": "Pradhan Mantri Awas Yojana - Gramin",
          "nameHindi": "प्रधानमंत्री आवास योजना - ग्रामीण",
          "category": "Housing",
          "categoryHindi": "आवास",
          "ministry": "Ministry of Rural Development",
          "description": "Housing assistance for rural homeless and kutcha houses",
          "descriptionHindi": "ग्रामीण बेघरों और कच्चे मकानों के लिए आवास सहायता",
          "benefits": "₹1.2 Lakh in plains, ₹1.3 Lakh in hilly areas",
          "benefitsHindi": "मैदानी क्षेत्रों में ₹1.2 लाख, पहाड़ी क्षेत्रों में ₹1.3 लाख",
          "eligibility": [
            "Homeless or living in kutcha houses",
            "Belonging to SC/ST/Minority/Others",
            "Household with no pucca house"
          ],
          "requiredDocuments": [
            "Aadhaar Card",
            "Bank account",
            "Income certificate",
            "Caste certificate (if applicable)"
          ],
          "applicationProcess": "Through Gram Panchayat or Block Development Office",
          "applicationDeadline": "31 March 2027",
          "website": "https://pmayg.nic.in",
          "helpline": "011-23060484"
        }
      }
    },
    {
      "PutRequest": {
        "Item": {
          "id": "MUDRA_001",
          "schemeId": "MUDRA_001",
          "name": "Pradhan Mantri MUDRA Yojana",
          "nameHindi": "प्रधानमंत्री मुद्रा योजना",
          "category": "Finance",
          "categoryHindi": "वित्त",
          "ministry": "Ministry of Finance",
          "description": "Micro-loans for small businesses and entrepreneurs",
          "descriptionHindi": "छोटे व्यवसायों और उद्यमियों के लिए सूक्ष्म ऋण",
          "benefits": "Loans up to ₹10 Lakh at affordable interest rates",
          "benefitsHindi": "किफायती ब्याज दरों पर ₹10 लाख तक के ऋण",
          "eligibility": [
            "Non-corporate, non-farm small businesses",
            "Manufacturing, trading, or service enterprises",
            "Income generating activities"
          ],
          "requiredDocuments": [
            "Business plan",
            "Identity proof",
            "Address proof",
            "Business address proof",
            "Income/sales proof"
          ],
          "applicationProcess": "Through banks, NBFCs, or MFIs",
          "applicationDeadline": "Always Open",
          "website": "https://www.mudra.org.in",
          "helpline": "1800-180-0111"
        }
      }
    },
    {
      "PutRequest": {
        "Item": {
          "id": "MGNREGA_001",
          "schemeId": "MGNREGA_001",
          "name": "Mahatma Gandhi NREGA",
          "nameHindi": "महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम",
          "category": "Employment",
          "categoryHindi": "रोजगार",
          "ministry": "Ministry of Rural Development",
          "description": "Guaranteed 100 days of wage employment to rural households",
          "descriptionHindi": "ग्रामीण परिवारों को 100 दिनों की मजदूरी रोजगार की गारंटी",
          "benefits": "Minimum wages for up to 100 days per household per year",
          "benefitsHindi": "प्रति परिवार प्रति वर्ष 100 दिनों तक न्यूनतम मजदूरी",
          "eligibility": [
            "Adult members of rural households",
            "Willing to do unskilled manual work"
          ],
          "requiredDocuments": [
            "Job Card (issued by Gram Panchayat)",
            "Aadhaar Card",
            "Bank account"
          ],
          "applicationProcess": "Apply at Gram Panchayat for Job Card",
          "applicationDeadline": "Always Open",
          "website": "https://nrega.nic.in",
          "helpline": "1800-345-22-44"
        }
      }
    }
  ]
}
```

## Alternative: Direct PUT items

If batch-write doesn't work, use individual PUT commands:

```bash
# Example for one scheme
aws dynamodb put-item \
  --table-name BolBharat-Schemes \
  --item file://scheme-item.json
```

## scheme-item.json template

```json
{
  "id": { "S": "PM_KISAN_001" },
  "schemeId": { "S": "PM_KISAN_001" },
  "name": { "S": "PM Kisan Samman Nidhi" },
  "nameHindi": { "S": "पीएम किसान सम्मान निधि" },
  "category": { "S": "Agriculture" },
  "categoryHindi": { "S": "कृषि" },
  "description": { "S": "Income support scheme..." },
  "benefits": { "S": "₹2,000 per installment..." },
  "eligibility": { "L": [
    { "S": "Small and marginal farmers" },
    { "S": "Land holding of up to 2 hectares" }
  ]},
  "applicationDeadline": { "S": "Always Open" },
  "website": { "S": "https://pmkisan.gov.in" },
  "helpline": { "S": "155261" }
}
```
