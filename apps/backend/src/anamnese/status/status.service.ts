import { BadRequestException, Injectable } from '@nestjs/common';
import { AnamneseAction } from 'src/common/enums/anamneseAction';
import { AnamneseStatus } from 'src/common/enums/anamneseStatus';
import { TRANSITIONS } from './transition.type';

@Injectable()
export class StatusService {
    transition(
        currentStatus: AnamneseStatus,
        action: AnamneseAction,
    ): AnamneseStatus {
        // Man hätte die Transitions auch mit dem State Pattern lösen können.
        // Ich habe mich dagegen entschieden, weil die States kein unterschiedliches Verhalten haben.
        // Außerdem hätte ich das Enum AnamneseStatus auf die States in einer Tabelle mappen müssen, oder den Code refactoren müssen.
        // Siehe transition.type.ts für ein Beispiel.

        const transition = TRANSITIONS.find(
            (trans) => trans.from === currentStatus && trans.action === action,
        );
        if (!transition) {
            throw new BadRequestException(
                `Der Übergang einer Anamnese vom Status ${currentStatus} mit der Aktion ${action} ist nicht erlaubt!`,
            );
        }
        return transition.to;
    }
}
