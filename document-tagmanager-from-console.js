/**
 * Generates a CSV file containing information about Matomo Tag Manager tags, triggers, and custom dimensions.
 * This function extracts data from the Matomo Tag Manager container and saves it to a CSV file.
 * It's useful for auditing and documenting your Matomo Tag Manager setup.
 */
function logMatomoTagsAndTriggers() {
    if (!window.MatomoTagManager || !window.MatomoTagManager.containers || window.MatomoTagManager.containers.length === 0) {
        console.log("Matomo Tag Manager container not found.");
        return;
    }

    const container = window.MatomoTagManager.containers[0];
    const tags = container.tags;
    const triggers = container.triggers;

    // Get the current domain
    const domain = window.location.hostname;

    let csvContent = "Type,ID,Name,Description,TrackingType,EventCategory,EventAction,EventName,Content,ReferencedTags,Issues\n";

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
        return value;
    }

    // Process Tags
    if (!tags || tags.length === 0) {
        csvContent += "Tag,No tags found,,,,,,,\n";
    } else {
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

                // Check for empty or whitespace-only category and action
                if (!eventCategory.trim() || !eventAction.trim()) {
                    issues += 'Event category or action is empty or whitespace. ';
                }
            }

            const safeCode = typeof code === 'string' ? code.replace(/"/g, '""').replace(/\n/g, ' ') : code;
            csvContent += `Tag,"${id}","${name}","${description.replace(/"/g, '""')}","${trackingType}","${eventCategory}","${eventAction}","${eventName}","${safeCode}",,"${issues}"\n`;
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
                    description = dim.value.parameters.jsFunction.substring(0, 50) + '...';
                } else if (type === 'DomElement') {
                    description = `Selector: ${dim.value.parameters.cssSelector || dim.value.parameters.elementId}`;
                }

                csvContent += `CustomDimension,"${index}","${name}","${type}","${description}",,,,\n`;
            });
        }
    }

    // Process Triggers
    if (!triggers || triggers.length === 0) {
        csvContent += "Trigger,No triggers found,,,,,,,,\n";
    } else {
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
                    let tagInfo = '';
                    if (tag.type) {
                        tagInfo += `Type: ${tag.type}`;
                    }
                    if (tag.name) {
                        tagInfo += tagInfo ? `, Name: ${tag.name}` : `Name: ${tag.name}`;
                    }
                    if (tag.fireTriggerIds && tag.fireTriggerIds.length > 0) {
                        tagInfo += tagInfo ? `, Fire Trigger IDs: ${tag.fireTriggerIds.join(', ')}` : `Fire Trigger IDs: ${tag.fireTriggerIds.join(', ')}`;
                    }
                    return tagInfo || JSON.stringify(tag);
                }).join(' | ');
            }

            csvContent += `Trigger,"${id}","${name}","${type}","${description.replace(/"/g, '""')}",,,,,"${referencedTags.replace(/"/g, '""')}"\n`;
        });
    }

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create a download link and trigger the download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `matomo_tags_triggers_and_variables_${domain}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Execute the function
logMatomoTagsAndTriggers();
