import { test, expect } from "@playwright/test";
import { StoreHomePage } from "./POM/home-page";
import { ClearancePage } from "./POM/clearance-page";
import { ContactPage } from "./POM/contact-page";
import { ShowcasePage } from "./POM/showcase-page";
import fs from "fs"; // Import the Node.js 'fs' module to read the JSON file containing test data.
import path from "path"; // Import the Node.js 'path' module to work with file paths.
import config from "../playwright.config";

const filePath = path.join(__dirname, '../tests/test-data/clearance-data.json'); // Construct the file path to the JSON file containing test data for clearance page.
const jsonData = fs.readFileSync(filePath, 'utf-8');
const ClearanceData = JSON.parse(jsonData);

// Determine the base URL from the Playwright configuration or use a fallback URL.
const baseURL = config.use?.baseURL ?? "https://free-5288352.webadorsite.com/";

test.describe(`Test 'Clearance' page by`, () => {
    // Declare variables for the Page Object Model (POM) classes to be used in the tests.
    let storeHomePage: StoreHomePage, clearancePage: ClearancePage, contactPage: ContactPage, showcasePage: ShowcasePage;

    // The `beforeEach` hook runs before every test in this `test.describe` block.
    test.beforeEach(async ({ page, request }) => {
        // Initialize the POM classes with the Playwright `page` fixture.
        storeHomePage = new StoreHomePage(page);
        clearancePage = new ClearancePage(page);
        contactPage = new ContactPage(page);
        showcasePage = new ShowcasePage(page);

        // Navigate to the store's home page using a POM method.
        await storeHomePage.gotoStoreHomePage(page, request);

        // Click the 'Clearance' menu item to navigate to the contact page.
        await storeHomePage.clickMenuItem(page, storeHomePage.clearanceMenuItem, `${baseURL}clearance`);

        // Assert that the navigation to the contact page was successful by checking the URL.
        await expect(page).toHaveURL(`${baseURL}clearance`);
    });

    test("validating the header and paragraph texts on the 'Clearance' page", async () => {
        // Validate that there are 3 headers on the Clearance page.
        await expect(clearancePage.pageHeader).toHaveCount(3);
        // Validate that there are 5 paragraph texts on the Clearance page.
        await expect(clearancePage.paragraphTexts).toHaveCount(5);
        // Validate the header and paragraph texts on the 'Clearance' page.
        let elementDetails = [
            {
                elementLocator: clearancePage.pageHeader, elementIndex: 0, elementText: `${ClearanceData.headerAndParagraphs[0].description}`
            },
            {
                elementLocator: clearancePage.pageHeader, elementIndex: 1, elementText: `${ClearanceData.headerAndParagraphs[1].description}`
            },
            {
                elementLocator: clearancePage.paragraphTexts, elementIndex: 0, elementText: `${ClearanceData.headerAndParagraphs[2].description}`
            },
            {
                elementLocator: clearancePage.paragraphTexts, elementIndex: 1, elementText: `${ClearanceData.headerAndParagraphs[3].description}`
            },
            {
                elementLocator: clearancePage.paragraphTexts, elementIndex: 2, elementText: `${ClearanceData.headerAndParagraphs[4].description}`
            },
            {
                elementLocator: clearancePage.paragraphTexts, elementIndex: 3, elementText: `${ClearanceData.headerAndParagraphs[5].description}`
            },
            {
                elementLocator: clearancePage.paragraphTexts, elementIndex: 4, elementText: `${ClearanceData.headerAndParagraphs[6].description}`
            }
        ];
        for (const [i, expectedElementDetails] of elementDetails.entries()) {
            await clearancePage.validateHeaderOrParagraphText(expectedElementDetails);
        }
    });

    test("validating that products can be sorted by value | label | index", async () => {
        // Select the dropdown to sort products by value, label, or index. toWaitForLoadingIndicator
        let elementDetails = [
            { elementLocator: clearancePage.sortByDropdown, elementIndex: 0, optionValue: "manual", toWaitForLoadingIndicator: false },
            { elementLocator: clearancePage.sortByDropdown, elementIndex: 0, optionValue: "created-desc" },
            { elementLocator: clearancePage.sortByDropdown, elementIndex: 0, optionValue: "price-asc" },
            { elementLocator: clearancePage.sortByDropdown, elementIndex: 0, optionValue: "manual" },
            { elementLocator: clearancePage.sortByDropdown, elementIndex: 0, optionValue: "price-desc" },
            { elementLocator: clearancePage.sortByDropdown, elementIndex: 0, optionValue: "title-asc" },
            { elementLocator: clearancePage.sortByDropdown, elementIndex: 0, optionValue: "title-desc", toWaitForLoadingIndicator: false }
        ];
        for (const [i, expectedElementDetails] of elementDetails.entries()) {
            await clearancePage.selectOptionByValueLabelOrIndex(expectedElementDetails);
        }
    });

    test("validating the 'Contact Us' button functionality", async () => {
        // Click the 'Contact Us' button and validate navigation to the Contact page.
        await contactPage.clickContactUsButtonAndValidateNavigation();
    });

    test("validating the images presence on the 'Clearance' page", async () => {
        // Validate that there are 3 images on the Clearance page.
        await expect(clearancePage.clearancePageImage).toHaveCount(3);
        // Validate that each image has the 'loading' attribute set to 'lazy'.
        let elementDetails = [
            { elementLocator: clearancePage.clearancePageImage, elementIndex: 0, attributeName: "data-jwlink-title", attributeValue:  `${ClearanceData.bestProducts[0].description}` },

            { elementLocator: clearancePage.clearancePageImage, elementIndex: 1, attributeName: "data-jwlink-title", attributeValue:  `${ClearanceData.bestProducts[1].description}` },

            { elementLocator: clearancePage.clearancePageImage, elementIndex: 2, attributeName: "data-jwlink-title", attributeValue: `${ClearanceData.bestProducts[2].description}` }
        ];
        for (const [i, expectedElementDetails] of elementDetails.entries()) {
            await showcasePage.validateElemAttribute(expectedElementDetails);
        }
    });

    test("validating the Best Products", async ({ page }) => {
        // Validate the details of 'Best product #1'.
        const bestProductDetails = [
            {
                productHeaderIndex: 0,
                productHeaderText: "Best product #1",
                productImageIndex: 0,
                buttonDisabledIndex: 3,
                productPriceIndex: 0,
                productCost: "CA$150.00",
                productDescriptionIndex: 0,
                productDescriptionText: "This is NOT a real product. It's item for testing. It can't be purchased or ordered.",
                buttonAddToWishListIndex: 3,
                seeDetailsButtonIndex: 0,
                clearanceLabelIndex: 0,
                productUrlRouting: "best-product-1"
            },
            {
                productHeaderIndex: 1,
                productHeaderText: "Best product #2",
                productImageIndex: 1,
                buttonDisabledIndex: 4,
                productPriceIndex: 1,
                productCost: "CA$1,050.00",
                productDescriptionIndex: 1,
                productDescriptionText: "This is NOT a real product. It's item for testing. It can't be purchased or ordered.",
                buttonAddToWishListIndex: 4,
                seeDetailsButtonIndex: 1,
                clearanceLabelIndex: 1,
                productUrlRouting: "best-product-2"
            },
            {
                productHeaderIndex: 2,
                productHeaderText: "Best product #3",
                productImageIndex: 2,
                buttonDisabledIndex: 5,
                productPriceIndex: 2,
                productCost: "CA$10,500.00",
                productDescriptionIndex: 2,
                productDescriptionText: "This is NOT a real product. It's item for testing. It can't be purchased or ordered.",
                buttonAddToWishListIndex: 5,
                seeDetailsButtonIndex: 2,
                clearanceLabelIndex: 2,
                productUrlRouting: "best-product-3"
            }
        ]
        for (const [i, expectedBestProductDetails] of bestProductDetails.entries()) {
            await clearancePage.validateBestProductDetails(expectedBestProductDetails);
            // Click the 'Clearance' menu item to navigate to the contact page.
            await storeHomePage.clickMenuItem(page, storeHomePage.clearanceMenuItem, `${baseURL}clearance`);
        }
    });

});