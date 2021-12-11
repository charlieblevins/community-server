/// <reference types="node" />
import type { Template, TemplateEngine } from './TemplateEngine';
import Dict = NodeJS.Dict;
/**
 * Calls the given array of {@link TemplateEngine}s in the order they appear,
 * feeding the output of one into the input of the next.
 *
 * The first engine will be called with the provided contents and template parameters.
 * All subsequent engines will be called with no template parameter.
 * Contents will still be passed along and another entry will be added for the body of the previous output.
 */
export declare class ChainedTemplateEngine<T extends Dict<any> = Dict<any>> implements TemplateEngine<T> {
    private readonly firstEngine;
    private readonly chainedEngines;
    private readonly renderedName;
    /**
     * @param engines - Engines will be executed in the same order as the array.
     * @param renderedName - The name of the key used to pass the body of one engine to the next.
     */
    constructor(engines: TemplateEngine[], renderedName?: string);
    render(contents: T): Promise<string>;
    render<TCustom = T>(contents: TCustom, template: Template): Promise<string>;
}
