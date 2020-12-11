import {AndroidVariant, UpsAdminClient} from '../../../../src';
import {VariantUpdate} from '../../../../src/commands/variants/Variant';
import {createApplications, getAllApplications, initMockEngine} from '../../mocks/UPSMock';
import {UPS_URL} from '../../mocks/constants';

beforeEach(() => {
  initMockEngine();
});

describe('UpdateAndroidVariantCommand', () => {
  const upsAdminClient = new UpsAdminClient(UPS_URL);

  it('Should update a variant name', async () => {
    createApplications({variantCount: 30});
    const testApp = getAllApplications()[5];
    const variantToUpdate = testApp.variants![12];
    const newName = 'new name';
    const update: VariantUpdate = {
      variantID: variantToUpdate.variantID!,
      type: variantToUpdate.type,
      name: newName,
    };

    await upsAdminClient.variants[variantToUpdate.type]
      .update(testApp.pushApplicationID, variantToUpdate.variantID)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .withVariantDefinition(update as any)
      .execute();

    const updatedVariant = (
      await upsAdminClient.variants.search(testApp.pushApplicationID).withVariantID(variantToUpdate.variantID).execute()
    )[0];

    expect(updatedVariant.name).toEqual(newName);
  });

  it('Should update googleKey', async () => {
    createApplications({variantCount: 30, variantType: 'android'});

    const testApp = getAllApplications()[5];
    const variantToUpdate = testApp.variants![12];
    const newGoogleKey = 'NEW GOOGLEKEYVALUE';

    await upsAdminClient.variants.android
      .update(testApp.pushApplicationID, variantToUpdate.variantID)
      .withGoogleKey(newGoogleKey)
      .execute();

    const updatedVariant = (
      await upsAdminClient.variants.search(testApp.pushApplicationID).withVariantID(variantToUpdate.variantID).execute()
    )[0] as AndroidVariant;

    expect(updatedVariant.googleKey).toEqual(newGoogleKey);
  });

  it('Should update name, projectnumber and googlekey', async () => {
    createApplications({variantCount: 30, variantType: 'android'});

    const testApp = getAllApplications()[5];
    const variantToUpdate = testApp.variants![12];
    const newName = 'newname';
    const newGoogleKey = 'NEW GOOGLEKEYVALUE';
    const newProjectNumber = 'NEW PRJ NUMBER';

    await upsAdminClient.variants.android
      .update(testApp.pushApplicationID, variantToUpdate.variantID)
      .withName(newName)
      .withGoogleKey(newGoogleKey)
      .withProjectNumber(newProjectNumber)
      .execute();

    const updatedVariant = (
      await upsAdminClient.variants.search(testApp.pushApplicationID).withVariantID(variantToUpdate.variantID).execute()
    )[0] as AndroidVariant;

    expect(updatedVariant.name).toEqual(newName);
    expect(updatedVariant.projectNumber).toEqual(newProjectNumber);
    expect(updatedVariant.googleKey).toEqual(newGoogleKey);
  });
});
