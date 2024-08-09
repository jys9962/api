import { Timestamp } from '@/common/value-object/timestamp/timestamp';

describe('Timestamp', function() {

  it('of date', async function() {
    const date = new Date(2020, 0, 1);
    const result = Timestamp.of(date);

    expect(result).toBe(date.getTime());
  });


  it('of date constructor', async function() {
    const result = Timestamp.of(2020, 0, 1);

    expect(result).toBe(new Date(2020, 0, 1).getTime());
  });

});
