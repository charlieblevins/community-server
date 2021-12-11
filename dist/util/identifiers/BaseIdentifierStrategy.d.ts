import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { IdentifierStrategy } from './IdentifierStrategy';
/**
 * Provides a default implementation for `getParentContainer`
 * which checks if the identifier is supported and not a root container.
 * If not, the last part before the first relevant slash will be removed to find the parent.
 */
export declare abstract class BaseIdentifierStrategy implements IdentifierStrategy {
    abstract supportsIdentifier(identifier: ResourceIdentifier): boolean;
    getParentContainer(identifier: ResourceIdentifier): ResourceIdentifier;
    abstract isRootContainer(identifier: ResourceIdentifier): boolean;
}
