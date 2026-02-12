import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- Required
import { Question } from '../../../../core/models/game-data.model';

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.scss']
})
export class QuestionCardComponent implements OnChanges {
  @Input() question!: Question;
  @Input() disabled: boolean = false;
  @Output() optionSelected = new EventEmitter<string>();

  selectedOptionId: string | null = null;

  ngOnChanges(): void {
    this.selectedOptionId = null;
  }

  selectOption(id: string) {
    if (this.disabled) return;
    this.selectedOptionId = id;
    this.optionSelected.emit(id);
  }
}