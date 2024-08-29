/**
 * Generates an Excel file containing information about Matomo Tag Manager tags, triggers, custom dimensions, and variables.
 * This function extracts data from the Matomo Tag Manager container and saves it to an Excel file with multiple sheets.
 * It's useful for auditing and documenting your Matomo Tag Manager setup.
 * 
 * This script is open source and free to use, modify, and distribute.
 * For more Matomo Tag Manager tools and snippets, visit:
 * https://github.com/tomper00/tomas-matomo-tagmanager-snippets/
 * 
 * Last updated: 2024-01-09
 * Just execute it in the console
 */

// Load the SheetJS library
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.5/xlsx.full.min.js';
document.head.appendChild(script);

// Wait for the script to load before executing the main function
script.onload = function() {
    // Your existing logMatomoTagsAndTriggers function goes here
    function logMatomoTagsAndTriggers() {
        if (!window.MatomoTagManager || !window.MatomoTagManager.containers || window.MatomoTagManager.containers.length === 0) {
            console.log("Matomo Tag Manager container not found.");
            return;
        }

        const container = window.MatomoTagManager.containers[0];
        const tags = container.tags;
        const triggers = container.triggers;
        const variables = container.variables;

        // Get the current domain
        const domain = window.location.hostname;

        // Create workbook and sheets
        const wb = XLSX.utils.book_new();
        const tagsSheet = [["ID", "Name", "Type", "Description", "TrackingType", "EventCategory", "EventAction", "EventName", "Content", "Issues"]];
        const triggersSheet = [["ID", "Name", "Type", "Description", "ReferencedTags"]];
        const dimensionsSheet = [["Index", "Name", "Type", "Description"]];
        const variablesSheet = [["ID", "Name", "Type", "LookupTable", "DefaultValue", "Parameters"]];

        function handleVariable(value) {
            if (typeof value === 'object') {
                if (value.joinedVariable) {
                    return Object.keys(value.joinedVariable)
                        .sort((a, b) => parseInt(a) - parseInt(b))
                        .map(key => handleVariable(value.joinedVariable[key]))
                        .join('');
                } else if (value.Variable) {
                    return `{{${value.Variable}}}`;
                } else if (value.type && value.name) {
                    return `{{${value.name}}}`;
                } else {
                    return JSON.stringify(value);
                }
            }
            // Return the full string without truncation
            return value;
        }

        // Process Tags
        if (tags && tags.length > 0) {
            tags.forEach(tag => {
                const id = tag.id || '';
                const type = tag.type || '';
                const name = tag.name || '';
                let description = '';
                let code = '';
                const trackingType = handleVariable(tag.parameters.trackingType) || '';
                let eventCategory = '';
                let eventAction = '';
                let eventName = '';
                let issues = '';

                if (type === 'Matomo') {
                    const config = tag.parameters && tag.parameters.matomoConfig;
                    if (config && config.parameters) {
                        const params = config.parameters;
                        description = `Matomo URL: ${params.matomoUrl}, Site ID: ${params.idSite}, Disable Cookies: ${params.disableCookies}`;
                    }
                } else if (type === 'CustomHtml') {
                    description = 'Custom HTML tag';
                    code = handleVariable(tag.parameters.customHtml || '');
                }

                if (trackingType === 'event') {
                    eventCategory = handleVariable(tag.parameters.eventCategory || '');
                    eventAction = handleVariable(tag.parameters.eventAction || '');
                    eventName = handleVariable(tag.parameters.eventName || '');

                    if (!eventCategory.trim() || !eventAction.trim()) {
                        issues += 'Event category or action is empty or whitespace. ';
                    }
                }

                tagsSheet.push([id, name, type, description, trackingType, eventCategory, eventAction, eventName, code, issues]);
            });
        }

        // Process Triggers
        if (triggers && triggers.length > 0) {
            triggers.forEach(trigger => {
                const id = trigger.id || '';
                const type = trigger.type || '';
                const name = trigger.name || '';
                let description = '';
                let referencedTags = '';

                if (trigger.conditions) {
                    description = JSON.stringify(trigger.conditions);
                }

                if (trigger.referencedTags && trigger.referencedTags.length > 0) {
                    referencedTags = trigger.referencedTags.map(tag => {
                        let tagInfo = [];
                        if (tag.type) tagInfo.push(`Type: ${tag.type}`);
                        if (tag.name) tagInfo.push(`Name: ${tag.name}`);
                        if (tag.fireTriggerIds && tag.fireTriggerIds.length > 0) {
                            tagInfo.push(`Fire Trigger IDs: ${tag.fireTriggerIds.join(', ')}`);
                        }
                        return tagInfo.join(', ');
                    }).join(' | ');
                }

                triggersSheet.push([id, name, type, description, referencedTags]);
            });
        }

        // Process Custom Dimensions
        const firstMatomoTag = tags.find(tag => tag.type === 'Matomo');
        if (firstMatomoTag && firstMatomoTag.parameters && firstMatomoTag.parameters.matomoConfig) {
            const customDimensions = firstMatomoTag.parameters.matomoConfig.parameters.customDimensions;
            if (customDimensions) {
                customDimensions.forEach(dim => {
                    const index = dim.index || '';
                    const name = dim.value.name || '';
                    const type = dim.value.type || '';
                    let description = '';

                    if (type === 'CustomJsFunction') {
                        // Capture the full function without truncation
                        description = dim.value.parameters.jsFunction;
                    } else if (type === 'DomElement') {
                        description = `Selector: ${dim.value.parameters.cssSelector || dim.value.parameters.elementId}`;
                    } else {
                        // For other types, stringify the entire value object
                        description = JSON.stringify(dim.value);
                    }

                    dimensionsSheet.push([index, name, type, description]);
                });
            }
        }

        // Process Variables
        if (variables && variables.length > 0) {
            variables.forEach(variable => {
                const id = variable.id || '';
                const name = variable.name || '';
                const type = variable.type || '';
                const lookupTable = JSON.stringify(variable.lookupTable || '');
                const defaultValue = variable.defaultValue || '';
                const parameters = JSON.stringify(variable.parameters || '');

                variablesSheet.push([id, name, type, lookupTable, defaultValue, parameters]);
            });
        }

        // Add sheets to workbook
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(tagsSheet), "Tags");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(triggersSheet), "Triggers");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(dimensionsSheet), "Custom Dimensions");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(variablesSheet), "Variables");

        // Generate Excel file
        XLSX.writeFile(wb, `matomo_tag_manager_${domain}.xlsx`);
    }

    // Execute the function
    logMatomoTagsAndTriggers();
};
