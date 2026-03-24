import { test, expect } from "@playwright/test";
import { StoreHomePage } from "./POM/home-page";
import { ContactPage } from "./POM/contact-page";
import config from "../playwright.config";
import fs from "fs"; // Import the Node.js 'fs' module to read the JSON file containing test data.
import path from "path"; // Import the Node.js 'path' module to work with file paths.

const filePath = path.join(__dirname, '../tests/test-data/contact-data.json'); // Construct the file path to the JSON file containing test data for contact page.
const jsonData = fs.readFileSync(filePath, 'utf-8');
const ContactData = JSON.parse(jsonData);

// Determine the base URL from the Playwright configuration or use a fallback URL.
const baseURL = config.use?.baseURL ?? "https://free-5288352.webadorsite.com/";

test.describe(`Test 'Contact' page by`, () => {
    // Declare variables for the Page Object Model (POM) classes to be used in the tests.
    let storeHomePage: StoreHomePage, contactPage: ContactPage;

    // The `beforeEach` hook runs before every test in this `test.describe` block.
    // It's used for setting up the test environment.
    test.beforeEach(async ({ page, request }) => {
        // Initialize the POM classes with the Playwright `page` fixture.
        storeHomePage = new StoreHomePage(page);
        contactPage = new ContactPage(page);

        // Navigate to the store's home page using a POM method.
        await storeHomePage.gotoStoreHomePage(page, request);

        // Click the 'Contact' menu item to navigate to the contact page.
        await storeHomePage.clickMenuItem(page, storeHomePage.contactMenuItem, `${baseURL}contact`);

        // Assert that the navigation to the contact page was successful by checking the URL.
        await expect(page).toHaveURL(`${baseURL}contact`);
    });

    test("verifying all form elements are present on the page", async ({ page }) => {
        // Validate the presence and visibility of all form elements.
        await contactPage.validateAllFormElementsPresence();
    });

    test("filling and submitting the contact form with valid data", async ({ page }) => {
        // Define test data for the contact form.
        const formData = {
            name: "John Doe",
            email: "john.doe@example.com",
            message: "This is a test message for the contact form."
        };

        // Clear all form fields.
        await contactPage.clearContactForm();

        // Fill the contact form with the test data.
        await contactPage.fillContactForm(formData);

        // Validate that the form fields contain the entered values.
        await contactPage.validateFormFieldValues(formData);

        // Submit the contact form.
        await contactPage.submitContactForm();

        // Validate that an error message is displayed after submission.
        await contactPage.validateErrorMessage();
    });

    test("filling form with partial data", async ({ page }) => {
        // Define test data with only some fields populated.
        const partialFormData = {
            name: "Jane Smith",
            email: "jane.smith@example.com"
            // message content is intentionally omitted
        };

        // Clear all form fields.
        await contactPage.clearContactForm();

        // Fill the contact form with partial data.
        await contactPage.fillContactForm(partialFormData);

        // Validate that only the provided fields contain the entered values.
        await contactPage.validateFormFieldValues(partialFormData);
    });

    test("clearing the contact form", async ({ page }) => {
        // Define test data to populate the form.
        const formData = {
            name: "Test User",
            email: "test@example.com",
            message: "Test message"
        };

        // Clear all form fields.
        await contactPage.clearContactForm();

        // Fill the form with test data.
        await contactPage.fillContactForm(formData);

        // Validate that the form was filled correctly.
        await contactPage.validateFormFieldValues(formData);

        // Clear all form fields.
        await contactPage.clearContactForm();

        // Verify that all form fields are now empty.
        await expect(contactPage.nameField).toHaveValue("");
        await expect(contactPage.emailField).toHaveValue("");
        await expect(contactPage.messageField).toHaveValue("");
    });

    test("navigating to contact page via URL and verifying page elements", async ({ page }) => {
        // Navigate directly to the contact page.
        await contactPage.gotoContactPage(page, page.context().request);

        // Validate that all form elements are present after direct navigation.
        await contactPage.validateAllFormElementsPresence();
    });

    test("submitting form with multiple data sets", async ({
        page
    }) => {
        // Define an array of test data for different contact form submissions.
        const contactFormTestCases = [
            {
                name: ContactData.contactFormData[0].name,
                email: ContactData.contactFormData[0].email,
                message: ContactData.contactFormData[0].message
            },
            {
                name: ContactData.contactFormData[1].name,
                email: ContactData.contactFormData[1].email,
                message: ContactData.contactFormData[1].message
            },
            {
                name: ContactData.contactFormData[2].name,
                email: ContactData.contactFormData[2].email,
                message: ContactData.contactFormData[2].message
            }
        ];

        // Iterate through each test case and submit the form.
        for (const testCase of contactFormTestCases) {
            // Clear the form before each submission.
            await contactPage.clearContactForm();

            // Fill the form with current test case data.
            await contactPage.fillContactForm(testCase);

            // Validate the form was filled correctly.
            await contactPage.validateFormFieldValues(testCase);

            // Submit the form.
            await contactPage.submitContactForm();

            // Validate that an error message is displayed after submission.
            await contactPage.validateErrorMessage();

            // Optionally navigate back to contact page for next iteration.
            if (contactFormTestCases.indexOf(testCase) < contactFormTestCases.length - 1) {
                await page.reload();
                await expect(page).toHaveURL(`${baseURL}contact`);
            }
        }
    });

    test.skip("enlarging the map and zooming out after zooming in", async () => {
        // Enlarge the map.
        await contactPage.enlargeOrMinimizeMap();

        // Zoom in and out a few times.
        await contactPage.clickZoomInButton(5);
        await contactPage.clickZoomOutButton(5);

        // Minimize the map.
        await contactPage.enlargeOrMinimizeMap();
    })

});
