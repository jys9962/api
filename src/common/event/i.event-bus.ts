import { IEvent } from '@nestjs/cqrs';

export abstract class IEventBus {

  abstract publish(event: IEvent): Promise<void>

}
