import { BadRequestException } from '@nestjs/common';
import { AnamneseAction } from 'src/common/enums/anamneseAction';
import { AnamneseStatus } from 'src/common/enums/anamneseStatus';
import { StatusService } from './status.service';

describe('StatusService', () => {
    let service: StatusService;

    beforeEach(() => {
        service = new StatusService();
    });

    describe('erlaubte Übergänge', () => {
        it('PENDING_VERIFICATION + VERIFY → SUBMITTED', () => {
            const result = service.transition(
                AnamneseStatus.PENDING_VERIFICATION,
                AnamneseAction.VERIFY,
            );
            expect(result).toBe(AnamneseStatus.SUBMITTED);
        });

        it('SUBMITTED + REVIEW → IN_REVIEW', () => {
            const result = service.transition(
                AnamneseStatus.SUBMITTED,
                AnamneseAction.REVIEW,
            );
            expect(result).toBe(AnamneseStatus.IN_REVIEW);
        });

        it('IN_REVIEW + COMPLETE → COMPLETED', () => {
            const result = service.transition(
                AnamneseStatus.IN_REVIEW,
                AnamneseAction.COMPLETE,
            );
            expect(result).toBe(AnamneseStatus.COMPLETED);
        });

        it('IN_REVIEW + REJECT → REJECTED', () => {
            const result = service.transition(
                AnamneseStatus.IN_REVIEW,
                AnamneseAction.REJECT,
            );
            expect(result).toBe(AnamneseStatus.REJECTED);
        });

        it('COMPLETED + ARCHIVE → ARCHIVED', () => {
            const result = service.transition(
                AnamneseStatus.COMPLETED,
                AnamneseAction.ARCHIVE,
            );
            expect(result).toBe(AnamneseStatus.ARCHIVED);
        });

        it('REJECTED + ARCHIVE → ARCHIVED', () => {
            const result = service.transition(
                AnamneseStatus.REJECTED,
                AnamneseAction.ARCHIVE,
            );
            expect(result).toBe(AnamneseStatus.ARCHIVED);
        });
    });

    describe('unerlaubte Übergänge', () => {
        it('wirft BadRequestException bei PENDING_VERIFICATION + REVIEW', () => {
            expect(() =>
                service.transition(
                    AnamneseStatus.PENDING_VERIFICATION,
                    AnamneseAction.REVIEW,
                ),
            ).toThrow(BadRequestException);
        });

        it('wirft BadRequestException bei SUBMITTED + COMPLETE', () => {
            expect(() =>
                service.transition(
                    AnamneseStatus.SUBMITTED,
                    AnamneseAction.COMPLETE,
                ),
            ).toThrow(BadRequestException);
        });

        it('wirft BadRequestException bei ARCHIVED + VERIFY', () => {
            expect(() =>
                service.transition(
                    AnamneseStatus.ARCHIVED,
                    AnamneseAction.VERIFY,
                ),
            ).toThrow(BadRequestException);
        });

        it('wirft BadRequestException bei IN_REVIEW + VERIFY', () => {
            expect(() =>
                service.transition(
                    AnamneseStatus.IN_REVIEW,
                    AnamneseAction.VERIFY,
                ),
            ).toThrow(BadRequestException);
        });
    });
});
