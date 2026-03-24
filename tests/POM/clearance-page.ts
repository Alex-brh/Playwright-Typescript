import { type Page, type Locator, expect, APIRequestContext } from "@playwright/test";
import { CommonlyUsedMethods } from "./commonly-used-methods";

interface BestProductDetails {
    productHeaderIndex?: number; // Optional.
    productImageIndex?: number; // Optional.
    buttonDisabledIndex?: number; // Optional.
    productPriceIndex?: number; // Optional.
    productDescriptionIndex?: number; // Optional.
    buttonAddToWishListIndex?: number; // Optional.
    seeDetailsButtonIndex?: number; // Optional.
    clearanceLabelIndex?: number; // Optional.
    productHeaderText?: string; // Optional.
    productCost?: string; // Optional.
    productDescriptionText?: string; // Optional.
    productUrlRouting?: string; // Optional.
    amountOfProductsDropdown?: number; // Optional.
    selectedAmountIndex?: number; // Optional.
}

export class ClearancePage {
    private commonMethods: CommonlyUsedMethods;
    readonly pageHeader: Locator;
    readonly paragraphTexts: Locator;
    readonly sortByDropdown: Locator;
    readonly clearancePageImage: Locator;
    readonly productHeaderLocator: Locator;
    readonly productImageLocator: Locator;
    readonly buttonDisabledLocator: Locator;
    readonly productPriceLocator: Locator;
    readonly productDescriptionLocator: Locator;
    readonly buttonAddToWishListLocator: Locator;
    readonly seeDetailsButtonLocator: Locator;
    readonly selectAmountDropDownListLocator: Locator;
    readonly clearanceLabelLocator: Locator;

    /**
     * Creates an instance of ClearancePage.
     * @param {Page} page - The Playwright Page object.
     */
    constructor(public readonly page: Page) {
        this.commonMethods = new CommonlyUsedMethods(this.page); // Initialize it here.
        // Page h2 headers (should be 2 in total on the Showcase page).
        this.pageHeader = this.page.locator('h2[class^="jw-heading"]');
        // Paragraph texts under each header (should be 12 in total right now).
        this.paragraphTexts = this.page.locator('div[class^="jw-element-imagetext-text"] > p');
        // Sort By dropdown locator
        this.sortByDropdown = this.page.locator('select[id^="product-gallery-sort"]');
        // Clearance page images.
        this.clearancePageImage = this.page.locator('a[class*="product-image"]');
        // Product header locator: used in 'Best product #1', #2, and #3 validations.
        this.productHeaderLocator = this.page.locator('h3[class="product__heading heading__no-margin"] > a'); // Use index to select specific product.
        // Product image locator: used in 'Best product #1', #2, and #3 validations.
        this.productImageLocator = this.page.locator('a[data-segment-type="product"] > img'); // Use index to select specific image.
        // 'Disabled' button locator: used in 'Best product #1', #2, and #3 validations.
        this.buttonDisabledLocator = this.page.locator('button[title="Disabled"][disabled]'); // There are 6 such buttons on the Clearance page.
        // 'Add to wish list' button locator: used in 'Best product #1', #2, and #3 validations.
        this.buttonAddToWishListLocator = this.page.locator('button[title="Add to wishlist"]'); // There are 6 such buttons on the Clearance page.
        // Product price locator: used in 'Best product #1', #2, and #3 validations.
        this.productPriceLocator = this.page.locator('div[class="product__price js-product-container__price"] > span'); // Use index to select specific product price.
        // Product description locator: used in 'Best product #1', #2, and #3 validations.
        this.productDescriptionLocator = this.page.locator('div[class="product__description"] > p'); // Use index to select specific product.
        // 'See details' button locator: used in 'Best product #1', #2, and #3 validations.
        this.seeDetailsButtonLocator = this.page.locator('div[class="product__long-description"] > a'); // Use index to select specific product.
        // Select-amount dropdown list locator: used in 'Best product #1', #2, and #3 validations.
        this.selectAmountDropDownListLocator = this.page.locator('select[class*="product-quantity-input__select"] > option'); // Use index to select specific product.
        // Clearance label locator: used in 'Best product #1', #2, and #3 validations.
        this.clearanceLabelLocator = this.page.locator('div[class="product__top"] > div[class="product-sticker"]'); // Use index to select specific product.
    }

    // **************************************************************************************************************
    /**
     * Validate the header or paragraph text on the Showcase page.
     * @param elementDetails - An object containing element validation details.
     * @param elementDetails.elementLocator - Required Locator pointing to the element(s) to validate.
     * @param elementDetails.elementIndex - Optional index of the element to validate (uses nth selector).
     * @param elementDetails.elementText - Optional text content to validate.
     * @returns {Promise<void>}
     * 
     * @example 
     * const elementDetails = {
     *     elementLocator: this.pageHeader,
     *     elementIndex: 0,
     *     elementText: 'Showcase',
     * };
     * await this.validateHeaderOrParagraphText(elementDetails);
     * 
     */
    async validateHeaderOrParagraphText(
        { elementLocator, elementIndex, elementText }:
            {
                elementLocator: Locator;
                elementIndex: number;
                elementText: string;
            }): Promise<void> {
        await this.commonMethods.validateElementText({
            elementLocator: elementLocator,
            elementIndex: elementIndex,
            elementText: elementText,
        });
    }
    // **************************************************************************************************************
    /**
     * Select an option from a dropdown by value, label, or index.
     * @param elementDetails - An object containing element selection details.
     * @param elementDetails.elementLocator - Required Locator pointing to the dropdown element.
     * @param elementDetails.elementIndex - Optional index of the dropdown element (uses nth selector).
     * @param elementDetails.optionValue - Optional value of the option to select.
     * @param elementDetails.optionLabel - Optional label of the option to select.
     * @param elementDetails.optionIndex - Optional index of the option to select.
     * @param elementDetails.toWaitForLoadingIndicator - true by default. Whether to wait for the loading indicator after selection.
     * @returns {Promise<void>}
     */
    async selectOptionByValueLabelOrIndex(elementDetails: {
        elementLocator: Locator;
        elementIndex: number;
        optionValue?: string;
        optionLabel?: string;
        optionIndex?: number;
        toWaitForLoadingIndicator?: boolean
    }): Promise<void> {
        await this.commonMethods.selectOptionByValueLabelOrIndex({
            elementLocator: elementDetails.elementLocator,
            elementIndex: elementDetails.elementIndex,
            optionValue: elementDetails.optionValue,
            optionLabel: elementDetails.optionLabel,
            optionIndex: elementDetails.optionIndex,
            toWaitForLoadingIndicator: elementDetails.toWaitForLoadingIndicator,
        });
    }
    // **************************************************************************************************************
    /**
     * Validate best product details.
     * @param bestProductDetails - An object containing details to validate.
     * @returns {Promise<void>}
     * 
     * @example 
     * const bestProductDetails = {
        *     productHeaderIndex: 0,
        *     productHeaderText: "Best product #1",
        *     productImageIndex: 0,
        *     buttonDisabledIndex: 3,
        *     productPriceIndex: 0,
        *     productCost: "CA$150.00",
        *     productDescriptionIndex: 0,   
        *     productDescriptionText: "This is NOT a real product. It's item for testing. It can't be purchased or ordered.",
        *     buttonAddToWishListIndex: 3,
        *     seeDetailsButtonIndex: 0,
        *     clearanceLabelIndex: 0,
        *     productUrlRouting: "best-product-1"
        * };     
     * await this.validateBestProductDetails(bestProductDetails);   
     }
     */
    async validateBestProductDetails(bestProductDetails: BestProductDetails): Promise<void> {
        const {
            productHeaderIndex,
            productImageIndex,
            buttonDisabledIndex,
            productPriceIndex,
            productDescriptionIndex,
            buttonAddToWishListIndex,
            seeDetailsButtonIndex,
            clearanceLabelIndex,
            productHeaderText,
            productCost,
            productDescriptionText,
            productUrlRouting,
            selectedAmountIndex
        } = bestProductDetails;
        if (productHeaderIndex !== undefined && productHeaderText !== undefined) {
            // Validate product header text.
            await this.commonMethods.validateElementText({
                elementLocator: this.productHeaderLocator,
                elementIndex: productHeaderIndex,
                elementText: productHeaderText,
            });
        }
        if (productImageIndex !== undefined) {
            // Validate that the product image is visible.
            await expect(this.productImageLocator.nth(productImageIndex)).toBeVisible();
        }
        if (buttonDisabledIndex !== undefined) {
            // Validate that the 'Disabled' button is visible.
            await expect(this.buttonDisabledLocator.nth(buttonDisabledIndex)).toBeAttached();
            this.buttonDisabledLocator.nth(buttonDisabledIndex).scrollIntoViewIfNeeded();
            // Validate that the 'Disabled' button has the 'Disabled' caption.
            await this.commonMethods.validateElementText({
                elementLocator: this.buttonDisabledLocator,
                elementIndex: buttonDisabledIndex,
                elementText: "Disabled",
            });
        }
        if (productPriceIndex !== undefined && productCost !== undefined) {
            // Validate product price text.
            await this.commonMethods.validateElementText({
                elementLocator: this.productPriceLocator,
                elementIndex: productPriceIndex,
                elementText: productCost,
            });
        }
        if (productDescriptionIndex !== undefined && productDescriptionText !== undefined) {
            // Validate product description text.
            await this.commonMethods.validateElementText({
                elementLocator: this.productDescriptionLocator,
                elementIndex: productDescriptionIndex,
                elementText: productDescriptionText,
            });
        }
        if (buttonAddToWishListIndex !== undefined) {
            // Validate that the 'Add to wish list' button is visible.
            await expect(this.buttonAddToWishListLocator.nth(buttonAddToWishListIndex)).toBeAttached();
            await expect(this.buttonAddToWishListLocator.nth(buttonAddToWishListIndex)).toBeDisabled();
        }
        if (clearanceLabelIndex !== undefined) {
            // Validate that the 'Clearance' label is visible.
            await expect(this.clearanceLabelLocator.nth(clearanceLabelIndex)).toBeAttached();
            // Validate that the 'Clearance' label has the 'Clearance' caption.
            await this.commonMethods.validateElementText({
                elementLocator: this.clearanceLabelLocator,
                elementIndex: clearanceLabelIndex,
                elementText: "Clearance",
            });
        }
        if (seeDetailsButtonIndex !== undefined) {
            // Validate that the 'See details' button is visible.
            await expect(this.seeDetailsButtonLocator.nth(seeDetailsButtonIndex)).toBeAttached();
            if (productUrlRouting !== undefined) {
                // Click the 'See details' button and validate navigation to the product details page.
                await this.seeDetailsButtonLocator.nth(seeDetailsButtonIndex).click();
                await this.page.waitForLoadState("load");
                await expect(this.page).toHaveURL(new RegExp(productUrlRouting));
                if (selectedAmountIndex !== undefined) {
                    // Validate that the select-amount dropdown has the correct number of options.
                    await expect(this.selectAmountDropDownListLocator.nth(selectedAmountIndex)).toBeAttached();
                }
            }

        }
    }

}