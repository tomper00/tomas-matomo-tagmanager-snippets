/**
 * Logs information about Matomo Tag Manager tags, triggers, and custom dimensions.
 * This function extracts data from the Matomo Tag Manager container and logs it to the console.
 * It's useful for debugging and auditing your Matomo Tag Manager setup.
 * Just copy & paste the code into the console and execute.
 * It will generate a csv file containing the sites tracking
 */
function logMatomoTagsAndTriggers() {
    // Check if Matomo Tag Manager is available
    if (!window.MatomoTagManager || !window.MatomoTagManager.containers || window.MatomoTagManager.containers.length === 0) {
        console.log("Matomo Tag Manager container not found.");
        return;
    }

    const container = window.MatomoTagManager.containers[0];
    const tags = container.tags;
    const triggers = container.triggers;

    // Log Tags
    if (!tags || tags.length === 0) {
        console.log("No tags found in the Matomo Tag Manager container.");
    } else {
        console.log("Tags:");
        tags.forEach(tag => {
            const id = tag.id || '';
            const type = tag.type || '';
            const name = tag.name || '';
            let description = '';
            let code = '';
            console.log(tag);

            // Handle different tag types
            if (type === 'Matomo') {
                const config = tag.parameters && tag.parameters.matomoConfig;
                if (config && config.parameters) {
                    const params = config.parameters;
                    description = `Matomo URL: ${params.matomoUrl}, Site ID: ${params.idSite}, Disable Cookies: ${params.disableCookies}`;
                }
            } else if (type === 'CustomHtml') {
                description = 'Custom HTML tag';
                code = tag.parameters.customHtml || (tag.parameters.customHtml && tag.parameters.customHtml.joinedVariable) || '';
            }

            console.log(`ID: ${id}, Type: ${type}, Name: ${name}, Description: ${description}`);
            if (type === 'CustomHtml' && code) {
                console.log(`Custom HTML Content:\n${code}`);
            }
        });
    }

    // Log Custom Dimensions
    console.log("\nCustom Dimensions:");
    const firstMatomoTag = tags.find(tag => tag.type === 'Matomo');
    if (firstMatomoTag && firstMatomoTag.parameters && firstMatomoTag.parameters.matomoConfig) {
        const customDimensions = firstMatomoTag.parameters.matomoConfig.parameters.customDimensions;
        if (customDimensions) {
            customDimensions.forEach(dim => {
                const index = dim.index || '';
                const name = dim.value.name || '';
                const type = dim.value.type || '';
                let description = '';

                // Handle different custom dimension types
                if (type === 'CustomJsFunction') {
                    description = dim.value.parameters.jsFunction.substring(0, 50) + '...';
                } else if (type === 'DomElement') {
                    description = `Selector: ${dim.value.parameters.cssSelector || dim.value.parameters.elementId}`;
                }

                console.log(`Index: ${index}, Name: ${name}, Type: ${type}, Description: ${description}`);
            });
        }
    }

    // Log Triggers
    if (!triggers || triggers.length === 0) {
        console.log("\nNo triggers found in the Matomo Tag Manager container.");
    } else {
        console.log("\nTriggers:");
        triggers.forEach(trigger => {
            const id = trigger.id || '';
            const type = trigger.type || '';
            const name = trigger.name || '';
            let description = '';

            // Add conditions to the description if they exist
            if (trigger.conditions) {
                description = `Conditions: ${JSON.stringify(trigger.conditions)}`;
            }

            console.log(`ID: ${id}, Type: ${type}, Name: ${name}, Description: ${description}`);
        });
    }
}

// Execute the function
logMatomoTagsAndTriggers();
