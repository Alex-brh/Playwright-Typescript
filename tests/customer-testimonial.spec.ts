import { test, expect } from '@playwright/test';
import { StoreHomePage } from './POM/home-page';
import { CustomerTestimonials } from './POM/customer-testimonials';
import fs from 'fs'; // Import the Node.js 'fs' module to read the JSON file containing test data.
import path from 'path'; // Import the Node.js 'path' module to work with file paths.
import config from '../playwright.config';

const filePath = path.join(__dirname, '../tests/test-data/customer-testimonials-data.json'); // Construct the file path to the JSON file containing test data for customer testimonials.
const jsonData = fs.readFileSync(filePath, 'utf-8');
const CustomerTestimonialsData = JSON.parse(jsonData);

// Determine the base URL from the Playwright configuration or use a fallback URL.
const baseURL = config.use?.baseURL ?? 'https://free-5288352.webadorsite.com/';

// Group related test cases for the "Store" page.
test.describe(`Test 'Customer Testimonials' page by`, () => {
    // Declare variables for the Page Object Model (POM) classes to be used in the tests.
    let storeHomePage: StoreHomePage, customerTestimonials: CustomerTestimonials;

    // Run before every test in this `test.describe` block.
    test.beforeEach(async ({ page, request }) => {
        // Initialize the POM classes with the Playwright `page` fixture.
        storeHomePage = new StoreHomePage(page);
        customerTestimonials = new CustomerTestimonials(page);

        // Navigate to the store's home page using a POM method.
        await storeHomePage.gotoStoreHomePage(page, request);

        // Click the 'Customer Testimonials' menu item to navigate to the 'Customer Testimonials' page.
        await storeHomePage.clickMenuItem(page, storeHomePage.customerTestimonialsMenuItem, `${baseURL}customer-testimonials`);

        // Assert that the navigation to the 'Customer Testimonials' page was successful by checking the URL.
        await expect(page).toHaveURL(`${baseURL}customer-testimonials`);
    });

    test(`validating the customer testimonials content`, async () => {
        const testimonials = [
            { expectedTestimonialsCount: 7, index: 0, expectedTestimonialsText: `"${CustomerTestimonialsData.customerTestimonials[0].testimonial}"` },
            { expectedTestimonialsCount: 7, index: 1, expectedTestimonialsText: `${CustomerTestimonialsData.customerTestimonials[0].name}` },
            { expectedTestimonialsCount: 7, index: 2, expectedTestimonialsText: `"${CustomerTestimonialsData.customerTestimonials[1].testimonial}"` },
            { expectedTestimonialsCount: 7, index: 3, expectedTestimonialsText: `${CustomerTestimonialsData.customerTestimonials[1].name}` },
            { expectedTestimonialsCount: 7, index: 4, expectedTestimonialsText: `"${CustomerTestimonialsData.customerTestimonials[2].testimonial}"` },
            { expectedTestimonialsCount: 7, index: 5, expectedTestimonialsText: `${CustomerTestimonialsData.customerTestimonials[2].name}` },
        ];
        for (const testimonial of testimonials) {
            await customerTestimonials.validateCustomerTestimonialsVisible(testimonial);
        }

    });

    test('validating errors on "Submit comment" without filling the form', async ({ page }) => {
        // Click the 'Submit comment' button without filling the form.
        await customerTestimonials.validateSubmitCommentErrors();
    });

    test('validating comments are present', async () => {
        const comments = [
            { comment: `${CustomerTestimonialsData.comments[0].comment}`, index: 0 },
            { comment: `${CustomerTestimonialsData.comments[1].comment}`, index: 1 },
        ];
        for (const comment of comments) {
            await customerTestimonials.validateCustomerCommentVisible(comment);
        }
    });

});