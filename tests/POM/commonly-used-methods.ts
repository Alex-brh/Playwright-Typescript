import { type Page, type Locator, expect, APIRequestContext } from "@playwright/test";

interface ElementDetails {
    elementLocator: Locator; // Required.
    elementIndex?: number | string; // Optional.
    elementHref?: string; // Optional.
    elementText?: string; // Optional.
    attributeName?: string; // Optional.
    attributeValue?: string; // Optional.
    optionValue?: string; // Optional.
    optionLabel?: string; // Optional.
    optionIndex?: number; // Optional.
    toWaitForLoadingIndicator?: boolean; // Optional.
}
interface SelectedOptionDetails {
    optionValue: string; // Required.
}

export class CommonlyUsedMethods {
    readonly dataLoadingIndicator: Locator;
    readonly dropDownSelectedOption: Locator;
    readonly sortDropDownCaret: Locator;

    constructor(public readonly page: Page) {
        // Data loading indicator locator
        this.dataLoadingIndicator = this.page.locator('div[class*="jw-element-is-loading"]');
        // Dropdown selected option locator
        this.dropDownSelectedOption = this.page.locator('select > option[selected]');
        // Sort dropdown caret locator
        this.sortDropDownCaret = this.page.locator('div[class="product-gallery-sorting js-product-gallery-sorting"] > select');
    }

    /**
     * Gets a locator for a selected option by its value.
     * @param {string} optionValue - The value of the option to find.
     * @returns {Locator} A locator pointing to the selected option with the specified value.
     */
    getSelectedOptionByValue(optionValue: string): Locator {
        return this.page.locator(`select > option[value="${optionValue}"][selected]`);
    }

    // **************************************************************************************************************
    /**
     * Validates element properties including href attribute, and text content.
     * This utility method scrolls the element into view and performs multiple assertions
     * based on the provided element details.
     *
     * @param {ElementDetails} elementDetails - An object containing element validation details.
     * @param {number} [elementDetails.elementIndex] - Optional index of the element to validate (uses nth selector).
     * @param {string} [elementDetails.elementHref] - Optional href attribute value to validate.
     * @param {string} [elementDetails.elementText] - Optional text content to validate.
     * @param {Locator} elementDetails.elementLocator - Required Locator pointing to the element(s) to validate.
     *
     * @returns {Promise<void>}
     *
     * @example
     * // Example 1: Validate element exists and has specific text
     * await commonMethods.validateElementText(page, {
     *   elementIndex: 0,
     *   elementText: "Welcome to our site",
     *   elementLocator: showcasePage.paragraphTexts
     * });
     *
     * @example
     * // Example 2: Validate link with href and text
     * await commonMethods.validateElementText(page, {
     *   elementIndex: 2,
     *   elementHref: "/products/item-a",
     *   elementText: "Product A",
     *   elementLocator: page.locator('a[class="product-link"]')
     * });
     */
    async validateElementText(elementDetails: ElementDetails): Promise<void> {
        const { elementIndex, elementHref, elementText, elementLocator } = elementDetails;

        if (elementIndex !== undefined && elementIndex !== null) {
            console.log(`Validating element: [${elementLocator}] at index: ${elementIndex}`);
            // Scroll the element into view, but only if it's not already visible.
            await elementLocator.nth(elementIndex).scrollIntoViewIfNeeded();
            await expect(elementLocator.nth(elementIndex)).toBeAttached();

            if (elementHref !== undefined && elementHref !== null) {
                console.log(`Validating href attribute: ${elementHref}`);
                await expect(elementLocator.nth(elementIndex)).toHaveAttribute("href", elementHref);
            }

            if (elementText !== undefined && elementText !== null) {
                console.log(`Validating text content: ${elementText}`);
                await expect(elementLocator.nth(elementIndex)).toHaveText(elementText);
            }
        }
        else {
            {
                throw new Error(`Missing required parameters. Please provide: elementLocator, elementIndex, attributeName, and attributeValue.`);
            }
        }
    }
    // **************************************************************************************************************
    /**
     * Validates element attributes by scrolling into view and verifying attribute values.
     * This utility method requires elementLocator, elementIndex, attributeName, and attributeValue
     * to be provided. It will log an error if any required parameters are missing.
     *
     * @param {ElementDetails} elementDetails - An object containing element validation details.
     * @param {Locator} elementDetails.elementLocator - Required Locator pointing to the element(s) to validate.
     * @param {number} elementDetails.elementIndex - Required index of the element to validate (uses nth selector).
     * @param {string} elementDetails.attributeName - Required name of the attribute to validate.
     * @param {string} elementDetails.attributeValue - Required expected value of the attribute.
     *
     * @returns {Promise<void>}
     *
     * @example
     * // Example 1: Validate data-testid attribute on an image element
     * await commonMethods.validateElementAttribute({
     *   elementLocator: showcasePage.images,
     *   elementIndex: 0,
     *   attributeName: "data-testid",
     *   attributeValue: "showcase-image-1"
     * });
     *
     * @example
     * // Example 2: Validate src attribute on a link element
     * await commonMethods.validateElementAttribute({
     *   elementLocator: page.locator('img[class="product-image"]'),
     *   elementIndex: 2,
     *   attributeName: "src",
     *   attributeValue: "https://example.com/images/product.jpg"
     * });
     */
    async validateElementAttribute(elementDetails: ElementDetails): Promise<void> {
        const { elementIndex, elementLocator, attributeName, attributeValue } = elementDetails;
        if (elementLocator !== undefined && elementLocator !== null &&
            elementIndex !== undefined && elementIndex !== null &&
            attributeName !== undefined && attributeName !== null &&
            attributeValue !== undefined && attributeValue !== null) {
            console.log(`Validating element: [${elementLocator}] at index: ${elementIndex} for attribute: ${attributeName} with value: ${attributeValue}`);
            // Scroll the element into view, but only if it's not already visible.
            await elementLocator.nth(elementIndex).scrollIntoViewIfNeeded();
            await expect(elementLocator.nth(elementIndex)).toBeAttached();
            console.log(`Validating attribute: ${attributeName} with attribute value: ${attributeValue}`);
            await expect(elementLocator.nth(elementIndex)).toHaveAttribute(attributeName, attributeValue);
        }
        else {
            throw new Error(`Missing required parameters. Please provide: elementLocator, elementIndex, attributeName, and attributeValue.`);
        }
    }
    // **************************************************************************************************************
    /**
     * @description Selects an option from a dropdown element by value, label, or index.
     * @param elementDetails An object containing details for selecting the option.
     * @param {Locator} elementDetails.elementLocator - Required Locator pointing to the dropdown element.
     * @param {number} elementDetails.elementIndex - Required index of the dropdown element to interact with (uses nth selector).
     * @param {string} [elementDetails.optionValue] - Optional value of the option to select.
     * @param {string} [elementDetails.optionLabel] - Optional label of the option to select.
     * @param {number} [elementDetails.optionIndex] - Optional index of the option to select.
     * @param {boolean} [elementDetails.toWaitForLoadingIndicator] - true by default. Whether to wait for the loading indicator after selection.
     * @returns {Promise<void>}
     * @example
     * await commonMethods.selectOptionByValueLabelOrIndex({
        *   elementLocator: commonPage.sortDropdown,
        *   elementIndex: 0,
        *   optionValue: 'price-asc',
        *   toWaitForLoadingIndicator: false        
        * });
        * // Example 2: Select option by label
        * await commonMethods.selectOptionByValueLabelOrIndex({
        *   elementLocator: commonPage.sortDropdown,
        *   elementIndex: 0,
        *   optionLabel: 'Price: Low to High',
        *   toWaitForLoadingIndicator: false        
        * });  
     */
    async selectOptionByValueLabelOrIndex(elementDetails: ElementDetails): Promise<void> {
        let { elementLocator, elementIndex, optionValue, optionLabel, optionIndex, toWaitForLoadingIndicator = true } = elementDetails;

        if (elementIndex !== undefined && elementIndex !== null) {
            console.log(`Validating element: [${elementLocator}] at index: ${elementIndex}`);
            // Scroll the element into view, but only if it's not already visible.
            await expect(elementLocator.nth(elementIndex)).toBeAttached({ timeout: 10000 });
            await elementLocator.nth(elementIndex).scrollIntoViewIfNeeded({ timeout: 15000 });
            await expect(elementLocator.nth(elementIndex)).toBeAttached({ timeout: 10000 });
            await expect(elementLocator.nth(elementIndex)).toBeVisible();
            await this.sortDropDownCaret.click(); // Click the caret to open the dropdown options.

            if (optionValue !== undefined && optionValue !== null) {
                console.log(`Select option value: [${optionValue}], to wait for loading indicator: ${toWaitForLoadingIndicator}`);
                await elementLocator.nth(elementIndex).selectOption({ value: optionValue });
                if (toWaitForLoadingIndicator) {
                    await this.waitForDataLoadingToComplete();
                }
                const selectedOption = this.getSelectedOptionByValue(optionValue);
                console.log(`Validating selected option with value: ${optionValue}`);
                await expect(this.dropDownSelectedOption.nth(0)).toBeAttached({ timeout: 10000 });
                await expect(this.dropDownSelectedOption.nth(0)).toHaveAttribute('value', optionValue);
                if (optionValue !== "manual") {
                    // Validate that URL contains the selected option value (except for 'manual').
                    await expect(this.page).toHaveURL(new RegExp(`=${optionValue}`), { timeout: 10000 });
                }
            }
            if (optionLabel !== undefined && optionLabel !== null) {
                console.log(`Select option label: ${optionLabel}`);
                await elementLocator.nth(elementIndex).selectOption({ label: optionLabel });
                if (toWaitForLoadingIndicator) {
                    await this.waitForDataLoadingToComplete();
                }
            }
            if (optionIndex !== undefined && optionIndex !== null) {
                console.log(`Select option index: ${optionIndex}`);
                await elementLocator.nth(elementIndex).selectOption({ index: optionIndex });
                if (toWaitForLoadingIndicator) {
                    await this.waitForDataLoadingToComplete();
                }
            }
        }
        else {
            {
                throw new Error(`Missing required parameters. Please provide: elementLocator, elementIndex, optionValue, optionLabel, optionIndex.`);
            }
        }
    }
    // **************************************************************************************************************
    /**
     * Waits for the data loading indicator to appear and then disappear.
     * @param timeoutVisible 
     * @param timeoutHidden 
     * @returns 
     * @example
     * await commonMethods.waitForDataLoadingToComplete();
     */
    async waitForDataLoadingToComplete(timeoutVisible = 10000, timeoutHidden = 25000): Promise<void> {
        const loader = this.dataLoadingIndicator
        // If loader is not visible quickly, assume nothing to wait for
        try {
            await loader.waitFor({ state: 'visible', timeout: timeoutVisible });
        } catch {
            // loader did not become visible within a short timeout — treat as no loader
            throw new Error(`No data loading indicator shows up.`);
        }
        // Loader became visible → wait for it to hide (longer timeout)
        await loader.waitFor({ state: 'hidden', timeout: timeoutHidden });
    }
    // **************************************************************************************************************

}