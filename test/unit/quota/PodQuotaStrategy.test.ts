import { RepresentationMetadata } from '../../../src/http/representation/RepresentationMetadata';
import type { ResourceIdentifier } from '../../../src/http/representation/ResourceIdentifier';
import type { DataAccessor } from '../../../src/storage/accessors/DataAccessor';
import { PodQuotaStrategy } from '../../../src/storage/quota/PodQuotaStrategy';
import type { Size } from '../../../src/storage/size-reporter/Size';
import type { SizeReporter } from '../../../src/storage/size-reporter/SizeReporter';
import type { IdentifierStrategy } from '../../../src/util/identifiers/IdentifierStrategy';
import { SingleRootIdentifierStrategy } from '../../../src/util/identifiers/SingleRootIdentifierStrategy';
import { PIM, RDF } from '../../../src/util/Vocabularies';
import { mockFs } from '../../util/Util';

jest.mock('fs');

describe('PodQuotaStrategy', (): void => {
  let strategy: PodQuotaStrategy;
  let mockSize: Size;
  let mockReporter: jest.Mocked<SizeReporter<any>>;
  let identifierStrategy: IdentifierStrategy;
  let accessor: jest.Mocked<DataAccessor>;
  const base = 'http://localhost:3000/';
  const rootFilePath = 'folder';

  beforeEach((): void => {
    jest.restoreAllMocks();
    mockFs(rootFilePath, new Date());
    mockSize = { amount: 2000, unit: 'bytes' };
    identifierStrategy = new SingleRootIdentifierStrategy(base);
    mockReporter = {
      getSize: jest.fn().mockResolvedValue({ unit: mockSize.unit, amount: 50 }),
      getUnit: jest.fn().mockReturnValue(mockSize.unit),
      calculateChunkSize: jest.fn(async(chunk: any): Promise<number> => chunk.length),
      estimateSize: jest.fn().mockResolvedValue(5),
    };
    accessor = {
      // Assume that the pod is called "nested"
      getMetadata: jest.fn().mockImplementation(
        async(identifier: ResourceIdentifier): Promise<RepresentationMetadata> => {
          const res = new RepresentationMetadata();
          if (identifier.path === `${base}nested/`) {
            res.add(RDF.type, PIM.Storage);
          }
          return res;
        },
      ),
      canHandle: jest.fn(),
      writeDocument: jest.fn(),
      getData: jest.fn(),
      getChildren: jest.fn(),
      writeContainer: jest.fn(),
      deleteResource: jest.fn(),
    };
    strategy = new PodQuotaStrategy(mockSize, mockReporter, identifierStrategy, accessor);
  });

  describe('getAvailableSpace()', (): void => {
    it('should return a Size containing MAX_SAFE_INTEGER when writing outside a pod.', async(): Promise<void> => {
      const result = strategy.getAvailableSpace({ path: `${base}file.txt` });
      await expect(result).resolves.toEqual(expect.objectContaining({ amount: Number.MAX_SAFE_INTEGER }));
    });
    it('should return a Size containing the available space when writing inside a pod.', async(): Promise<void> => {
      const getSizeSpy = jest.spyOn(mockReporter, 'getSize');
      const result = strategy.getAvailableSpace({ path: `${base}nested/nested2/file.txt` });
      await expect(result).resolves.toEqual(expect.objectContaining({ amount: mockSize.amount }));
      expect(getSizeSpy).toHaveBeenCalledTimes(2);
    });
    it('should return a Size containing the available space when writing inside a pod 2.', async(): Promise<void> => {
      const getSizeSpy = jest.spyOn(mockReporter, 'getSize');
      accessor.getMetadata.mockImplementationOnce((): any => {
        throw new Error('error');
      });
      const result = strategy.getAvailableSpace({ path: `${base}nested/nested2/file.txt` });
      await expect(result).resolves.toEqual(expect.objectContaining({ amount: mockSize.amount }));
      expect(getSizeSpy).toHaveBeenCalledTimes(2);
    });
  });
});
